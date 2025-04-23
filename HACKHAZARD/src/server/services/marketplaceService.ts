import { ethers } from 'ethers';
import { Content } from '../models/Content';
import { processPayment } from './transactionService';

const provider = new ethers.providers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);
const MARKETPLACE_ADDRESS = process.env.MARKETPLACE_ADDRESS as string;
const MARKETPLACE_ABI = process.env.MARKETPLACE_ABI as string;




export const listContentForSale = async (contentId: string, price: string, royaltyPercentage: number) => {
  try {
    const content = await Content.findById(contentId).populate('creator');
    if (!content) throw new Error('Content not found');

    if (!content.nftAddress) {
      throw new Error('Content must be minted as NFT first');
    }

    // Marketplace contract interaction
    const contract = new ethers.Contract(MARKETPLACE_ADDRESS, JSON.parse(MARKETPLACE_ABI), wallet);
    const tx = await contract.listItem(content.nftAddress, ethers.utils.parseEther(price), royaltyPercentage);
    await tx.wait();

    content.price = Number(price);
    await content.save();

    return {
      contentId: content._id,
      price,
      royaltyPercentage,
      seller: content.creator.walletAddress
    };
  } catch (error) {
    console.error('Error listing content:', error);
    throw new Error('Failed to list content for sale');
  }
};

export const purchaseContent = async (contentId: string, buyerAddress: string) => {
  try {
    const content = await Content.findById(contentId).populate('creator');
    if (!content) throw new Error('Content not found');

    if (!content.price) {
      throw new Error('Content is not listed for sale');
    }

    // Process payment
    const payment = await processPayment(contentId, buyerAddress, content.price.toString());

    // Marketplace contract interaction for NFT transfer
    const contract = new ethers.Contract(MARKETPLACE_ADDRESS, JSON.parse(MARKETPLACE_ABI), wallet);
    const tx = await contract.executeSale(content.nftAddress, buyerAddress);
    await tx.wait();

    return payment;
  } catch (error) {
    console.error('Error purchasing content:', error);
    throw new Error('Failed to purchase content');
  }
};

export const getMarketplaceListings = async (filters?: {
  contentType?: string;
  priceRange?: { min: number; max: number };
  creator?: string;
}) => {
  try {
    let query = Content.find({ price: { $exists: true } });

    if (filters?.contentType) {
      query = query.where('contentType').equals(filters.contentType);
    }

    if (filters?.priceRange) {
      query = query.where('price').gte(filters.priceRange.min).lte(filters.priceRange.max);
    }

    if (filters?.creator) {
      query = query.where('creator').equals(filters.creator);
    }

    const listings = await query.populate('creator').sort('-createdAt');

    interface MarketplaceListing {
      contentId: string;
      title: string;
      price: number;
      creator: string;
      contentType: string;
      nftAddress?: string;
    }

    interface ContentDocument extends Document {
      _id: string;
      title: string;
      price: number;
      creator: {
        username: string;
        walletAddress: string;
      };
      contentType: string;
      nftAddress?: string;
    }

    return listings.map((listing: ContentDocument): MarketplaceListing => ({
      contentId: listing._id.toString(),
      title: listing.title,
      price: listing.price,
      creator: listing.creator.username,
      contentType: listing.contentType,
      nftAddress: listing.nftAddress
    }));
  } catch (error) {
    console.error('Error fetching marketplace listings:', error);
    throw new Error('Failed to fetch marketplace listings');
  }
};