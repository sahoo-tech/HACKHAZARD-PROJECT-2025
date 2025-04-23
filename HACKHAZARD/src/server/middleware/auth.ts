import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { _id: string };
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

export const generateToken = (user: IUser): string => {
  return jwt.sign({ _id: (user._id as string).toString() }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

export const verifyWalletSignature = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { signature, message, walletAddress } = req.body;
    
    if (!signature || !message || !walletAddress) {
      throw new Error('Missing required fields');
    }
    
    // TODO: Implement actual signature verification using ethers.js or web3.js
    const isValid = true;

    if (!isValid) {
      throw new Error('Invalid signature');
    }

    next();
  } catch {
    res.status(401).json({ message: 'Invalid wallet signature' });
  }
};