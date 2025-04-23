import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';
import dotenv from 'dotenv';

dotenv.config();

const projectId = process.env.INFURA_PROJECT_ID;
const projectSecret = process.env.INFURA_PROJECT_SECRET;

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth
  }
});

export const uploadToIPFS = async (file: Buffer): Promise<string> => {
  try {
    const result = await client.add(file);
    return result.path;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload to IPFS');
  }
};

export const getFromIPFS = async (cid: string): Promise<Buffer> => {
  try {
    const chunks = [];
    for await (const chunk of client.cat(cid)) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  } catch (error) {
    console.error('Error getting from IPFS:', error);
    throw new Error('Failed to get from IPFS');
  }
};

export const pinToIPFS = async (cid: string): Promise<void> => {
  try {
    await client.pin.add(cid);
  } catch (error) {
    console.error('Error pinning to IPFS:', error);
    throw new Error('Failed to pin to IPFS');
  }
};