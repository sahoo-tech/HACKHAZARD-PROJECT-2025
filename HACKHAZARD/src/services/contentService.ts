import api from './api';

export interface Content {
  id?: string;
  title: string;
  description: string;
  contentType: 'audio' | 'video' | 'image' | 'text';
  ipfsHash?: string;
  creatorAddress: string;
  licenseType?: string;
  price?: number;
}

export interface ContentLicense {
  contentId: string;
  licenseType: string;
  duration: number;
  price: number;
  terms: string;
}

class ContentService {
  private readonly baseUrl = '/api/content';

  async uploadContent(content: FormData) {
    try {
      const response = await api.post(`${this.baseUrl}/upload`, content, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading content:', error);
      throw error;
    }
  }

  async getContent(contentId: string) {
    try {
      const response = await api.get(`${this.baseUrl}/${contentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching content:', error);
      throw error;
    }
  }

  async getCreatorContent(creatorAddress: string) {
    try {
      const response = await api.get(`${this.baseUrl}/creator/${creatorAddress}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching creator content:', error);
      throw error;
    }
  }

  async createLicense(contentId: string, license: ContentLicense) {
    try {
      const response = await api.post(`${this.baseUrl}/${contentId}/license`, license);
      return response.data;
    } catch (error) {
      console.error('Error creating license:', error);
      throw error;
    }
  }

  async purchaseLicense(contentId: string, licenseId: string) {
    try {
      const response = await api.post(`${this.baseUrl}/${contentId}/license/${licenseId}/purchase`);
      return response.data;
    } catch (error) {
      console.error('Error purchasing license:', error);
      throw error;
    }
  }

  async updateContent(contentId: string, content: Partial<Content>) {
    try {
      const response = await api.put(`${this.baseUrl}/${contentId}`, content);
      return response.data;
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  }
}

export const contentService = new ContentService();