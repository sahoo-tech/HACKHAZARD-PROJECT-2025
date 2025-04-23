import mongoose from 'mongoose';

export interface IContent extends mongoose.Document {
  creator: mongoose.Types.ObjectId;
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
}

const contentSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true,
    enum: ['image', 'audio', 'video', 'text']
  },
  ipfsHash: {
    type: String,
    required: true,
    unique: true
  },
  nftAddress: {
    type: String,
    unique: true,
    sparse: true
  },
  license: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  price: {
    type: Number,
    min: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

contentSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const Content = mongoose.model<IContent>('Content', contentSchema);