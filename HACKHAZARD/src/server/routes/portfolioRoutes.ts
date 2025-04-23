import express from 'express';
import { Portfolio } from '../models/Portfolio';
import { auth } from '../middleware/auth';
import type { AuthRequest } from '../middleware/auth';

const router = express.Router();

// Create portfolio
router.post('/', auth, async (req: AuthRequest, res) => {
  try {
    const portfolio = new Portfolio({
      ...req.body,
      owner: req.user?._id
    });
    await portfolio.save();
    res.status(201).json(portfolio);
  } catch (error) {
    res.status(400).json({ message: 'Error creating portfolio' });
  }
});

// Get all portfolios for a user
router.get('/', auth, async (req: AuthRequest, res) => {
  try {
    const portfolios = await Portfolio.find({ owner: req.user?._id });
    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolios' });
  }
});

// Get specific portfolio
router.get('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolio' });
  }
});

// Update portfolio
router.patch('/:id', auth, async (req: AuthRequest, res) => {
  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      { _id: req.params.id, owner: req.user?._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    res.json(portfolio);
  } catch (error) {
    res.status(400).json({ message: 'Error updating portfolio' });
  }
});

// Delete portfolio
router.delete('/:id', auth, async (req: AuthRequest, res) => {
  try {
    const portfolio = await Portfolio.findOneAndDelete({
      _id: req.params.id,
      owner: req.user?._id
    });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    res.json({ message: 'Portfolio deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting portfolio' });
  }
});

export const portfolioRoutes = router;