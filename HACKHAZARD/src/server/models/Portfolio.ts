import mongoose from 'mongoose';

export interface IPortfolio extends mongoose.Document {
  owner: mongoose.Types.ObjectId;
  title: string;
  description: string;
  theme: string;
  sections: {
    type: string;
    title: string;
    content: any;
  }[];
  customDomain?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const portfolioSchema = new mongoose.Schema({
  owner: {
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
  theme: {
    type: String,
    required: true,
    default: 'default'
  },
  sections: [{
    type: {
      type: String,
      required: true,
      enum: ['gallery', 'about', 'contact', 'store', 'blog']
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  }],
  customDomain: {
    type: String,
    unique: true,
    sparse: true
  },
  published: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const Portfolio = mongoose.model<IPortfolio>('Portfolio', portfolioSchema);