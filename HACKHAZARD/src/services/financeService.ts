import api from './api';

export interface Earnings {
  id?: string;
  creatorAddress: string;
  amount: number;
  currency: string;
  source: 'license' | 'tip' | 'subscription' | 'royalty';
  timestamp: Date;
}

export interface RoyaltyPayment {
  contentId: string;
  amount: number;
  recipientAddress: string;
  percentage: number;
}

export interface RemittanceRequest {
  amount: number;
  currency: string;
  destinationAddress: string;
  paymentMethod: string;
}

class FinanceService {
  private readonly baseUrl = '/api/finance';

  async getEarnings(creatorAddress: string, startDate?: Date, endDate?: Date) {
    try {
      const params = { startDate, endDate };
      const response = await api.get(`${this.baseUrl}/earnings/${creatorAddress}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching earnings:', error);
      throw error;
    }
  }

  async getRoyalties(contentId: string) {
    try {
      const response = await api.get(`${this.baseUrl}/royalties/${contentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching royalties:', error);
      throw error;
    }
  }

  async setupRoyalty(royalty: RoyaltyPayment) {
    try {
      const response = await api.post(`${this.baseUrl}/royalties/setup`, royalty);
      return response.data;
    } catch (error) {
      console.error('Error setting up royalty:', error);
      throw error;
    }
  }

  async requestRemittance(request: RemittanceRequest) {
    try {
      const response = await api.post(`${this.baseUrl}/remittance`, request);
      return response.data;
    } catch (error) {
      console.error('Error requesting remittance:', error);
      throw error;
    }
  }

  async getTaxReport(creatorAddress: string, year: number) {
    try {
      const response = await api.get(`${this.baseUrl}/tax/${creatorAddress}/${year}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tax report:', error);
      throw error;
    }
  }

  async getTransactionHistory(creatorAddress: string, page = 1, limit = 10) {
    try {
      const params = { page, limit };
      const response = await api.get(`${this.baseUrl}/transactions/${creatorAddress}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }
}

export const financeService = new FinanceService();