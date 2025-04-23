import { ethers } from 'ethers';
import { Web3Storage } from 'web3.storage';

export interface UploadMetadata {
  title: string;
  description: string;
  contentType: string;
  creator: string;
  license: string;
  price: string;
  ipfsHash: string;
  timestamp: number;
}

class UploadService {
  

  
  private provider: ethers.providers.Web3Provider;
  private signer: ethers.Signer;

  constructor() {
    // Initialize ethers provider using window.ethereum
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer = this.provider.getSigner();
  }

  async uploadToIPFS(file: File): Promise<string> {
    try {
      const client = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN || '' });
      const cid = await client.put([file], {
        wrapWithDirectory: false
      });
      return cid;
    } catch (error) {
      console.error('IPFS upload failed:', error);
      throw new Error('Failed to upload to IPFS');
    }
  }

  async createNFT(metadata: UploadMetadata): Promise<string> {
    try {
      const contractAddress = process.env.CREATOR_CONTENT_ADDRESS || '';
      const contract = new ethers.Contract(
        contractAddress,
        [
          'function mintContent(string memory ipfsHash, string memory contentType, string memory license, uint256 price, uint256 royaltyPercentage, bool isExclusive) external returns (uint256)'
        ],
        this.signer
      );

      const tx = await contract.mintContent(
        metadata.ipfsHash,
        metadata.contentType,
        metadata.license,
        ethers.utils.parseEther(metadata.price),
        10, // Default royalty percentage
        false // Default to non-exclusive
      );

      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('NFT minting failed:', error);
      throw new Error('Failed to mint NFT');
    }
  }

  async uploadContent(file: File, metadata: Omit<UploadMetadata, 'ipfsHash' | 'timestamp'>) {
    try {
      // Upload file to IPFS
      const ipfsHash = await this.uploadToIPFS(file);

      // Create full metadata
      const fullMetadata: UploadMetadata = {
        ...metadata,
        ipfsHash,
        timestamp: Date.now(),
      };

      // Create NFT
      const txHash = await this.createNFT(fullMetadata);

      return {
        success: true,
        ipfsHash,
        txHash,
        metadata: fullMetadata,
      };
    } catch (error) {
      console.error('Upload failed:', error);
      throw new Error('Failed to upload content');
    }
  }

  async connectWallet(): Promise<string> {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = await this.signer.getAddress();
      return address;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw new Error('Failed to connect wallet');
    }
  }
}

export default new UploadService();