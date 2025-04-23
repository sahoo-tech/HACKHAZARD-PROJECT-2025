import { Document, Types } from 'mongoose';
import { IUser } from '../models/User';

export interface ICollaborator {
  user: IUser;
  revenueShare: number;
}

export interface IContentStats {
  revenue: number;
}

export interface IContentDocument extends Document {
  creator: IUser;
  title: string;
  description: string;
  contentType: 'image' | 'audio' | 'video' | 'text';
  ipfsHash: string;
  nftAddress?: string;
  license: string;
  tags: string[];
  price?: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  stats: IContentStats;
  collaborators: ICollaborator[];
}