import StellarSdk from 'stellar-sdk';
import { ethers } from 'ethers';
import { NFTStorage } from 'nft.storage';
import dotenv from 'dotenv';

dotenv.config();

// Primary Stellar configurations
const STELLAR_NETWORK = process.env.STELLAR_NETWORK || 'TESTNET';
const STELLAR_SERVER = new StellarSdk.Server(
  STELLAR_NETWORK === 'TESTNET' 
    ? 'https://horizon-testnet.stellar.org' 
    : 'https://horizon.stellar.org'
);

// Ethereum fallback configurations
const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY || '';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS || '';

// NFT Contract ABI (simplified version)
const NFT_ABI = [
  'function mint(address to, string memory tokenURI) public returns (uint256)',
  'function tokenURI(uint256 tokenId) public view returns (string memory)'
];

// Initialize NFT.Storage client
const nftStorage = new NFTStorage({ token: NFT_STORAGE_KEY });

// Initialize ethers provider and signer
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const nftContract = new ethers.Contract(CONTRACT_ADDRESS, NFT_ABI, wallet);

export const mintNFT = async (ipfsHash: string, name: string, description: string): Promise<string> => {
  try {
    // Create metadata
    const metadata = {
      name,
      description,
      image: `ipfs://${ipfsHash}`
    };

    // Store metadata on IPFS
    const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    const metadataCid = await nftStorage.storeBlob(metadataBlob);

    // Mint NFT
    const tx = await nftContract.mint(wallet.address, `ipfs://${metadataCid}`);
    const receipt = await tx.wait();

    // Get the token ID from the event logs
    const event = receipt.events?.find((e: ethers.Event) => e.event === 'Transfer');
    const tokenId = event?.args?.tokenId;

    return `${CONTRACT_ADDRESS}/${tokenId}`;
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw new Error('Failed to mint NFT');
  }
};

export const verifyNFTOwnership = async (nftAddress: string, walletAddress: string): Promise<boolean> => {
  try {
    const [contractAddress, tokenId] = nftAddress.split('/');
    const contract = new ethers.Contract(contractAddress, NFT_ABI, provider);
    
    const owner = await contract.ownerOf(tokenId);
    return owner.toLowerCase() === walletAddress.toLowerCase();
  } catch (error) {
    console.error('Error verifying NFT ownership:', error);
    return false;
  }
};

export const createStellarWallet = async (): Promise<{publicKey: string, secret: string}> => {
  try {
    const pair = StellarSdk.Keypair.random();
    return {
      publicKey: pair.publicKey(),
      secret: pair.secret()
    };
  } catch (error) {
    console.error('Error creating Stellar wallet:', error);
    throw new Error('Failed to create Stellar wallet');
  }
};

export const sendStellarPayment = async (
  senderSecret: string,
  destinationPublicKey: string,
  amount: string,
  assetCode: string = 'XLM',
  assetIssuer?: string
): Promise<string> => {
  try {
    const senderKeypair = StellarSdk.Keypair.fromSecret(senderSecret);
    const account = await STELLAR_SERVER.loadAccount(senderKeypair.publicKey());

    let asset;
    if (assetCode === 'XLM') {
      asset = StellarSdk.Asset.native();
    } else if (assetIssuer) {
      asset = new StellarSdk.Asset(assetCode, assetIssuer);
    } else {
      throw new Error('Asset issuer required for non-XLM assets');
    }

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: STELLAR_NETWORK === 'TESTNET' 
        ? StellarSdk.Networks.TESTNET 
        : StellarSdk.Networks.PUBLIC
    })
      .addOperation(StellarSdk.Operation.payment({
        destination: destinationPublicKey,
        asset: asset,
        amount: amount
      }))
      .setTimeout(30)
      .build();

    transaction.sign(senderKeypair);
    const result = await STELLAR_SERVER.submitTransaction(transaction);
    return result.hash;
  } catch (error) {
    console.error('Error sending Stellar payment:', error);
    throw new Error('Failed to send Stellar payment');
  }
};

export const issueStellarAsset = async (
  issuerSecret: string,
  assetCode: string,
  amount: string,
  distributionPublicKey?: string
): Promise<string> => {
  try {
    const issuerKeypair = StellarSdk.Keypair.fromSecret(issuerSecret);
    const issuerAccount = await STELLAR_SERVER.loadAccount(issuerKeypair.publicKey());

    let transactionBuilder = new StellarSdk.TransactionBuilder(issuerAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: STELLAR_NETWORK === 'TESTNET' 
        ? StellarSdk.Networks.TESTNET 
        : StellarSdk.Networks.PUBLIC
    });

    // Create asset
    transactionBuilder = transactionBuilder
      .addOperation(StellarSdk.Operation.changeTrust({
        asset: new StellarSdk.Asset(assetCode, issuerKeypair.publicKey())
      }));

    // Distribute initial amount if specified
    if (distributionPublicKey) {
      transactionBuilder = transactionBuilder
        .addOperation(StellarSdk.Operation.payment({
          destination: distributionPublicKey,
          asset: new StellarSdk.Asset(assetCode, issuerKeypair.publicKey()),
          amount: amount,
          source: issuerKeypair.publicKey()
        }));
    }

    const transaction = transactionBuilder.setTimeout(30).build();
    transaction.sign(issuerKeypair);
    const result = await STELLAR_SERVER.submitTransaction(transaction);
    return result.hash;
  } catch (error) {
    console.error('Error issuing Stellar asset:', error);
    throw new Error('Failed to issue Stellar asset');
  }
};