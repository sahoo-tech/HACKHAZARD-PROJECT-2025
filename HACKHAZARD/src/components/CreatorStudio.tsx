import { useState } from 'react';
import uploadService from '../services/uploadService';
import { UploadMetadata } from '../services/uploadService';
import './CreatorStudio.css';

export default function CreatorStudio() {
  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<UploadMetadata>({
    title: '',
    description: '',
    contentType: 'audio',
    license: 'open',
    price: '0',
    creator: '',
    ipfsHash: '',
    timestamp: 0
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      await uploadService.uploadContent(file, metadata);
      alert('Content uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    }
  };

  return (
    <div className="creator-studio">
      <h1>Creator Studio</h1>
      
      <div className="tabs">
        <button
          className={activeTab === 'upload' ? 'active' : ''}
          onClick={() => setActiveTab('upload')}
        >
          Upload & Register
        </button>
        <button
          className={activeTab === 'tokenize' ? 'active' : ''}
          onClick={() => setActiveTab('tokenize')}
        >
          Auto-tokenize
        </button>
        <button
          className={activeTab === 'licenses' ? 'active' : ''}
          onClick={() => setActiveTab('licenses')}
        >
          Licenses
        </button>
        <button
          className={activeTab === 'splits' ? 'active' : ''}
          onClick={() => setActiveTab('splits')}
        >
          Co-creator Splits
        </button>
        <button
          className={activeTab === 'ai-tools' ? 'active' : ''}
          onClick={() => setActiveTab('ai-tools')}
        >
          AI Tools
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'upload' && (
          <div className="upload-section">
            <h2>Upload & Register Creative Works</h2>
            <input
              type="file"
              accept="audio/*,video/*,image/*,text/*"
              onChange={handleFileChange}
            />
            <input
              type="text"
              placeholder="Title"
              value={metadata.title}
              onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={metadata.description}
              onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
            />
            <select
              value={metadata.contentType}
              onChange={(e) => setMetadata({ ...metadata, contentType: e.target.value })}
            >
              <option value="audio">Audio</option>
              <option value="video">Video</option>
              <option value="text">Text</option>
              <option value="visual">Visual</option>
              <option value="performance">Performance</option>
            </select>
            <button onClick={handleUpload}>Upload Content</button>
          </div>
        )}

        {activeTab === 'tokenize' && (
          <div className="tokenize-section">
            <h2>Auto-tokenize Content</h2>
            
            <div className="form-group">
              <label>Content Valuation (ETH)</label>
              <input 
                type="number" 
                placeholder="0.01" 
                min="0" 
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label>Royalty Percentage</label>
              <input 
                type="number" 
                placeholder="10" 
                min="0" 
                max="100"
              />
            </div>
            
            <div className="form-group">
              <label>Fractional Ownership</label>
              <select>
                <option value="false">Disabled</option>
                <option value="true">Enabled</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Smart Contract Deployment</label>
              <select>
                <option value="standard">Standard ERC-721</option>
                <option value="custom">Custom Contract</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Token Metadata</label>
              <textarea 
                placeholder='{"name": "My Token", "description": "...", "image": "ipfs://..."}'
              />
            </div>
            
            <button>Generate Tokenization Contract</button>
          </div>
        )}

        {activeTab === 'licenses' && (
          <div className="licenses-section">
            <h2>Generate Usage Licenses</h2>
            <select
              value={metadata.license}
              onChange={(e) => setMetadata({ ...metadata, license: e.target.value })}
            >
              <option value="open">Open License</option>
              <option value="closed">Closed License</option>
              <option value="remixable">Remixable License</option>
              <option value="dao">DAO-based License</option>
            </select>
          </div>
        )}

        {activeTab === 'splits' && (
          <div className="splits-section">
            <h2>Co-creator Splits & Royalties</h2>
            <input
              type="number"
              placeholder="Price in ETH"
              value={metadata.price}
              onChange={(e) => setMetadata({ ...metadata, price: e.target.value })}
            />
            {/* Co-creator management interface will be implemented here */}
          </div>
        )}

        {activeTab === 'ai-tools' && (
          <div className="ai-tools-section">
            <h2>AI-assisted Tools</h2>
            <div className="ai-tools-grid">
              <button>Transcribe</button>
              <button>Translate</button>
              <button>Add Subtitles</button>
              <button>Remix Content</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}