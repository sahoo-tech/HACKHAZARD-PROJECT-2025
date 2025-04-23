import { useState, ChangeEvent, FormEvent } from 'react';
import uploadService from '../services/uploadService';

type ContentType = 'art' | 'music' | 'story' | 'code';

interface UploadFormData {
  title: string;
  description: string;
  contentType: ContentType;
  file: File | null;
  price: string;
  license: string;
}

export default function CreatorUpload() {
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    description: '',
    contentType: 'art',
    file: null,
    price: '',
    license: 'standard'
  });

  const [preview, setPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, file }));

      // Create preview for supported file types
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.file) return;
      setIsLoading(true);
      setTxStatus('Connecting wallet...');
      
      const metadata = {
        title: formData.title,
        description: formData.description,
        contentType: formData.contentType,
        creator: await uploadService.connectWallet(),
        license: formData.license,
        price: formData.price
      };
      
      setTxStatus('Uploading to IPFS...');
      const result = await uploadService.uploadContent(formData.file, metadata);
      
      setTxStatus('Minting NFT...');
      console.log('Upload successful:', result);
      alert('Content uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
      setTxStatus('');
    }
  };

  return (
    <div className="creator-upload">
      <h2>Upload Your Creation</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="contentType">Content Type</label>
          <select
            id="contentType"
            name="contentType"
            value={formData.contentType}
            onChange={handleInputChange}
          >
            <option value="art">Art</option>
            <option value="music">Music</option>
            <option value="story">Story</option>
            <option value="code">Code</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="file">File</label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            accept={formData.contentType === 'art' ? 'image/*' :
                   formData.contentType === 'music' ? 'audio/*' :
                   formData.contentType === 'story' ? '.pdf,.doc,.docx,.txt' :
                   '.zip,.js,.py,.tsx,.jsx,.sol'}
            required
          />
        </div>

        {preview && formData.contentType === 'art' && (
          <div className="preview">
            <img src={preview} alt="Preview" />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="price">Price (ETH)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            step="0.001"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="license">License Type</label>
          <select
            id="license"
            name="license"
            value={formData.license}
            onChange={handleInputChange}
          >
            <option value="standard">Standard License</option>
            <option value="exclusive">Exclusive License</option>
            <option value="commercial">Commercial License</option>
          </select>
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Upload Creation'}
        </button>
        {txStatus && <div className="tx-status">{txStatus}</div>}
      </form>
    </div>
  );
}