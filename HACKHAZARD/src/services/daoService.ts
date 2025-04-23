import api from './api';

export interface DAOConfig {
  name: string;
  description: string;
  tokenName: string;
  tokenSymbol: string;
  initialSupply: number;
}

export interface DAOVote {
  proposalId: string;
  vote: boolean;
  voterAddress: string;
}

export interface DAOProposal {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  options: string[];
}

class DAOService {
  private readonly baseUrl = '/api/dao';

  async createDAO(config: DAOConfig) {
    try {
      const response = await api.post(`${this.baseUrl}/create`, config);
      return response.data;
    } catch (error) {
      console.error('Error creating DAO:', error);
      throw error;
    }
  }

  async getDAODetails(daoAddress: string) {
    try {
      const response = await api.get(`${this.baseUrl}/${daoAddress}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching DAO details:', error);
      throw error;
    }
  }

  async createProposal(daoAddress: string, proposal: DAOProposal) {
    try {
      const response = await api.post(`${this.baseUrl}/${daoAddress}/proposals`, proposal);
      return response.data;
    } catch (error) {
      console.error('Error creating proposal:', error);
      throw error;
    }
  }

  async castVote(daoAddress: string, vote: DAOVote) {
    try {
      const response = await api.post(`${this.baseUrl}/${daoAddress}/vote`, vote);
      return response.data;
    } catch (error) {
      console.error('Error casting vote:', error);
      throw error;
    }
  }

  async getProposals(daoAddress: string) {
    try {
      const response = await api.get(`${this.baseUrl}/${daoAddress}/proposals`);
      return response.data;
    } catch (error) {
      console.error('Error fetching proposals:', error);
      throw error;
    }
  }
}

export const daoService = new DAOService();