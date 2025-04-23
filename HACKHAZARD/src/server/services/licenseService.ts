import { Content } from '../models/Content';
import { User } from '../models/User';
import { ethers } from 'ethers';

interface LicenseTerms {
  type: 'exclusive' | 'non-exclusive' | 'creative-commons' | 'custom';
  duration?: number; // in days
  territories?: string[];
  usage?: string[];
  price: number;
}

export const createLicense = async (contentId: string, buyerId: string, terms: LicenseTerms) => {
  try {
    if (!terms || !terms.type || typeof terms.price !== 'number') {
      throw new Error('Invalid license terms - must include type and numeric price');
    }
    
    const content = await Content.findById(contentId);
    const buyer = await User.findById(buyerId);

    if (!content || !buyer) {
      throw new Error('Content or buyer not found');
    }

    // Create license record
    const license = {
      contentId: content._id,
      buyerId: buyer._id,
      sellerId: content.creator,
      terms,
      issuedAt: new Date(),
      expiresAt: terms.duration ? new Date(Date.now() + terms.duration * 24 * 60 * 60 * 1000) : null,
      status: 'active'
    };

    // Store license on blockchain
    if (!process.env.WEB3_PROVIDER_URL || !process.env.PRIVATE_KEY || 
        !process.env.LICENSE_CONTRACT_ADDRESS || !process.env.LICENSE_ABI) {
      throw new Error('Missing blockchain configuration');
    }
    
    if (!process.env.PRIVATE_KEY) throw new Error('PRIVATE_KEY environment variable is required');
    const provider = new ethers.providers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL as string);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);
    
    // Smart contract interaction for license registration
    const contract = new ethers.Contract(process.env.LICENSE_CONTRACT_ADDRESS as string, JSON.parse(process.env.LICENSE_ABI as string), wallet);
    const tx = await contract.issueLicense(license);
    await tx.wait();

    return license;
  } catch (error) {
    console.error('License creation error:', error);
    throw new Error('Failed to create license');
  }
};

export const verifyLicense = async (contentId: string, userId: string) => {
  try {
    if (!contentId) throw new Error('Content ID is required');
    const content = await Content.findById(contentId);
    if (!content) throw new Error('Content not found');

    // Check if user is content creator
    if (content.creator.toString() === userId) return true;

    // Verify license on blockchain
    if (!process.env.PRIVATE_KEY) throw new Error('PRIVATE_KEY environment variable is required');
    const provider = new ethers.providers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL as string);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);
    const contract = new ethers.Contract(process.env.LICENSE_CONTRACT_ADDRESS as string, JSON.parse(process.env.LICENSE_ABI as string), wallet);
    const isValid = await contract.verifyLicense(contentId, userId);
    
    // Return actual verification result from blockchain
    return isValid;
  } catch (error) {
    console.error('License verification error:', error);
    return false;
  }
};

export const getLicenseHistory = async (contentId: string) => {
  try {
    if (!contentId) throw new Error('Content ID is required');
    if (!contentId) throw new Error('Content ID is required');
    const content = await Content.findById(contentId);
    if (!content) throw new Error('Content not found');

    if (!process.env.WEB3_PROVIDER_URL || !process.env.PRIVATE_KEY || 
        !process.env.LICENSE_CONTRACT_ADDRESS || !process.env.LICENSE_ABI) {
      throw new Error('Missing blockchain configuration');
    }
    
    // Fetch license history from blockchain
    if (!process.env.PRIVATE_KEY) throw new Error('PRIVATE_KEY environment variable is required');
    const provider = new ethers.providers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL as string);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);
    const contract = new ethers.Contract(process.env.LICENSE_CONTRACT_ADDRESS as string, JSON.parse(process.env.LICENSE_ABI as string), wallet);
    const history = await contract.getLicenseHistory(contentId);
    
    // Return actual license history from blockchain
    return history;
  } catch (error) {
    console.error('License history error:', error);
    throw new Error('Failed to fetch license history');
  }
};