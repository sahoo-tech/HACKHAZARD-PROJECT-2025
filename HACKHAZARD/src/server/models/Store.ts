import mongoose from 'mongoose';

export interface IStore extends mongoose.Document {
  owner: mongoose.Types.ObjectId;
  name: string;
  description: string;
  products: {
    contentId: mongoose.Types.ObjectId;
    price: number;
    currency: string;
    type: 'digital' | 'physical';
    stock?: number;
    shipping?: {
      weight: number;
      dimensions: {
        length: number;
        width: number;
        height: number;
      };
    };
  }[];
  paymentMethods: string[];
  earnings: {
    total: number;
    pending: number;
    currency: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  products: [{
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      required: true,
      default: 'ETH'
    },
    type: {
      type: String,
      required: true,
      enum: ['digital', 'physical']
    },
    stock: {
      type: Number,
      min: 0
    },
    shipping: {
      weight: Number,
      dimensions: {
        length: Number,
        width: Number,
        height: Number
      }
    }
  }],
  paymentMethods: [{
    type: String,
    enum: ['crypto', 'fiat'],
    required: true
  }],
  earnings: {
    total: {
      type: Number,
      default: 0
    },
    pending: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'ETH'
    }
  }
}, {
  timestamps: true
});

export const Store = mongoose.model<IStore>('Store', storeSchema);