import { ethers } from 'ethers';
import { Content } from '../models/Content';
import { IContentDocument } from '../types/content';

const provider = new ethers.providers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL || '');
if (!process.env.PRIVATE_KEY) {
  throw new Error('PRIVATE_KEY environment variable is not set');
}

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

export const processPayment = async (contentId: string, buyerAddress: string, amount: string): Promise<{ transactionHash: string; amount: string; buyer: string; seller: string }> => {
  try {
    const contentDoc = await Content.findById(contentId).populate('creator');
    if (!contentDoc || !('stats' in contentDoc) || !('collaborators' in contentDoc)) {
      throw new Error('Invalid content document structure');
    }
    const content = contentDoc.toObject() as unknown as IContentDocument;
    if (!content) throw new Error('Content not found');

    // Create and send transaction
    const tx = {
      to: content.creator.walletAddress,
      value: ethers.utils.parseEther(amount)
    };

    const transaction = await wallet.sendTransaction(tx);
    const receipt = await transaction.wait();

    // Update content revenue stats
    content.stats.revenue += Number(amount);
    await content.save();

    return {
      transactionHash: receipt.transactionHash || '',
      amount,
      buyer: buyerAddress,
      seller: content.creator.walletAddress
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    throw new Error('Failed to process payment');
  }
};

export const distributeRevenue = async (contentId: string, amount: string): Promise<string[]> => {
  try {
    const contentDoc = await Content.findById(contentId)
      .populate('creator')
      .populate('collaborators.user');
    
    if (!contentDoc || !('stats' in contentDoc) || !('collaborators' in contentDoc)) {
      throw new Error('Invalid content document structure');
    }
    
    const content = contentDoc.toObject() as unknown as IContentDocument;
    
    if (!content) throw new Error('Content not found');

    const transactions = [];

    // Calculate and distribute shares
    for (const collaborator of content.collaborators) {
      const share = (collaborator.revenueShare / 100) * Number(amount);
      const tx = {
        to: collaborator.user.walletAddress,
        value: ethers.utils.parseEther(share.toString())
      };
      transactions.push(wallet.sendTransaction(tx));
    }

    // Process all transactions
    const receipts = await Promise.all(transactions);

    return receipts.map(receipt => receipt?.hash || '');
  } catch (error) {
    console.error('Revenue distribution error:', error);
    throw new Error('Failed to distribute revenue');
  }
};

export const getTransactionHistory = async (address: string): Promise<Array<{ hash: string; from: string; to: string | null; value: string; timestamp: number | null }>> => {
  try {
    const history = await provider.getBlockNumber()
        .then(async (latestBlock) => {
            const startBlock = Math.max(0, latestBlock - 10000); // Get last 10000 blocks
            const filter = {
                address: address,
                fromBlock: startBlock,
                toBlock: 'latest'
            };
            return await provider.getLogs(filter);
        });
    return await Promise.all(history.map(async (log) => {
      const transaction = await provider.getTransaction(log.transactionHash);
      if (!transaction) {
        return {
          hash: log.transactionHash,
          from: '',
          to: null,
          value: '0',
          timestamp: null
        };
      }
      return {
        hash: log.transactionHash,
        from: transaction.from || '',
        to: transaction.to || null,
        value: ethers.utils.formatEther(transaction.value || 0),
        timestamp: null // Timestamp needs to be fetched from block if needed
      };
    }));
  } catch (error) {
    console.error('Transaction history error:', error);
    throw new Error('Failed to fetch transaction history');
  }
};