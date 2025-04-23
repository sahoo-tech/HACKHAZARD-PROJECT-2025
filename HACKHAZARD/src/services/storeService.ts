import api from './api';

export interface Product {
  id?: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  creatorAddress: string;
  contentId?: string;
  type: 'digital' | 'subscription' | 'license';
}

export interface Subscription {
  id?: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in months
  benefits: string[];
  creatorAddress: string;
}

export interface Purchase {
  productId: string;
  buyerAddress: string;
  amount: number;
  currency: string;
  timestamp: Date;
}

class StoreService {
  private readonly baseUrl = '/api/store';

  async createProduct(product: Product) {
    try {
      const response = await api.post(`${this.baseUrl}/products`, product);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async getProduct(productId: string) {
    try {
      const response = await api.get(`${this.baseUrl}/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async getCreatorProducts(creatorAddress: string) {
    try {
      const response = await api.get(`${this.baseUrl}/products/creator/${creatorAddress}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching creator products:', error);
      throw error;
    }
  }

  async createSubscription(subscription: Subscription) {
    try {
      const response = await api.post(`${this.baseUrl}/subscriptions`, subscription);
      return response.data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  async getSubscription(subscriptionId: string) {
    try {
      const response = await api.get(`${this.baseUrl}/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }
  }

  async purchaseProduct(productId: string) {
    try {
      const response = await api.post(`${this.baseUrl}/purchase/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error purchasing product:', error);
      throw error;
    }
  }

  async subscribeToCreator(creatorAddress: string, subscriptionId: string) {
    try {
      const response = await api.post(`${this.baseUrl}/subscribe/${creatorAddress}`, { subscriptionId });
      return response.data;
    } catch (error) {
      console.error('Error subscribing to creator:', error);
      throw error;
    }
  }

  async getPurchaseHistory(userAddress: string) {
    try {
      const response = await api.get(`${this.baseUrl}/purchases/${userAddress}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching purchase history:', error);
      throw error;
    }
  }
}

export const storeService = new StoreService();