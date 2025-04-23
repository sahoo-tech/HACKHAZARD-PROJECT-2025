import api from './api';
import { StellarSdk } from 'stellar-sdk';

export interface User {
  id?: string;
  publicKey: string;
  username?: string;
  email?: string;
  createdAt?: Date;
  lastLoginAt?: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private readonly baseUrl = '/api/auth';
  private server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

  async register(publicKey: string, username?: string, email?: string): Promise<AuthResponse> {
    try {
      const response = await api.post(`${this.baseUrl}/register`, {
        publicKey,
        username,
        email
      });
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  async login(publicKey: string, signature: string): Promise<AuthResponse> {
    try {
      const response = await api.post(`${this.baseUrl}/login`, {
        publicKey,
        signature
      });
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async verifySignature(publicKey: string, signature: string, challenge: string): Promise<boolean> {
    try {
      const keypair = StellarSdk.Keypair.fromPublicKey(publicKey);
      return keypair.verify(Buffer.from(challenge), Buffer.from(signature, 'base64'));
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  }

  async getAuthChallenge(publicKey: string): Promise<string> {
    try {
      const response = await api.get(`${this.baseUrl}/challenge/${publicKey}`);
      return response.data.challenge;
    } catch (error) {
      console.error('Error getting auth challenge:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/logout`);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get(`${this.baseUrl}/me`);
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }
}

export const authService = new AuthService();