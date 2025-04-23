import express from 'express';
import { Content } from '../models/Content';
import { auth } from '../middleware/auth';
import type { AuthRequest } from '../middleware/auth';
import { uploadToIPFS } from '../services/ipfsService';
import { mintNFT } from '../services/blockchainService';

const router = express.Router();

// Create new content
router.post('/', auth, async (req: AuthRequest, res) => {
  try {
    const { title, description, contentType, file, license, tags, price } = req.body;
    
    // Upload content to IPFS
    const ipfsHash = await uploadToIPFS(file);
    
    const content = new Content({
      creator: req.user?._id,
      title,
      description,
      contentType,
      ipfsHash,
      license,
      tags,
      price
    });

    await content.save();
    res.status(201).json(content);
  } catch (error) {
    res.status(400).json({ message: 'Error creating content' });
  }
});

// Mint content as NFT
router.post('/:id/mint', auth, async (req: AuthRequest, res) => {
  try {
    const content = await Content.findOne({ _id: req.params.id, creator: req.user?._id });
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    const nftAddress = await mintNFT(content.ipfsHash, content.title, content.description);
    content.nftAddress = nftAddress;
    await content.save();

    res.json(content);
  } catch (error) {
    res.status(400).json({ message: 'Error minting NFT' });
  }
});

// Get user's content
router.get('/my-content', auth, async (req: AuthRequest, res) => {
  try {
    const content = await Content.find({ creator: req.user?._id });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching content' });
  }
});

// Get published content
router.get('/published', async (req, res) => {
  try {
    const content = await Content.find({ isPublished: true })
      .populate('creator', 'username')
      .sort({ createdAt: -1 });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching content' });
  }
});

// Update content
router.patch('/:id', auth, async (req: AuthRequest, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'license', 'tags', 'price', 'isPublished'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    const content = await Content.findOne({ _id: req.params.id, creator: req.user?._id });
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    updates.forEach(update => {
      (content as any)[update] = req.body[update];
    });

    await content.save();
    res.json(content);
  } catch (error) {
    res.status(400).json({ message: 'Error updating content' });
  }
});

// Delete content
router.delete('/:id', auth, async (req: AuthRequest, res) => {
  try {
    const content = await Content.findOneAndDelete({ _id: req.params.id, creator: req.user?._id });
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ message: 'Content deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting content' });
  }
});

export const contentRoutes = router;