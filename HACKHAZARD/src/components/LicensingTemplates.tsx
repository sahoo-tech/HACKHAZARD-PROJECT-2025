
import './CreatorStudio.css';

export default function LicensingTemplates() {
  return (
    <div className="creator-studio">
      <h1>Licensing Templates</h1>
      
      <div className="ai-tools-section">
        <p>Customize and create your own licensing templates</p>
        
        <div className="ai-tools-grid">
          <div className="tool-card">
            <h3>Creative Commons</h3>
            <p>Standard CC licenses for your creative work</p>
            <button>Select License</button>
          </div>
          
          <div className="tool-card">
            <h3>Commercial Use</h3>
            <p>Licenses for commercial applications</p>
            <button>Configure</button>
          </div>
          
          <div className="tool-card">
            <h3>Royalty Agreements</h3>
            <p>Set up royalty sharing terms</p>
            <button>Create Agreement</button>
          </div>
          
          <div className="tool-card">
            <h3>Custom License</h3>
            <p>Build your own license from scratch</p>
            <button>Design License</button>
          </div>
        </div>
      </div>
    </div>
  );
}