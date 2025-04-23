
import './CreatorStudio.css';

export default function WebsiteBuilder() {
  return (
    <div className="creator-studio">
      <h1>Website Builder</h1>
      
      <div className="ai-tools-section">
        <p>Chain-integrated website builder designed for creators</p>
        
        <div className="ai-tools-grid">
          <div className="tool-card">
            <h3>Portfolio Site</h3>
            <p>Showcase your creative work with customizable templates</p>
            <button>Build Portfolio</button>
          </div>
          
          <div className="tool-card">
            <h3>Storefront</h3>
            <p>Sell your digital and physical creations with built-in payments</p>
            <button>Create Store</button>
          </div>
          
          <div className="tool-card">
            <h3>Gallery</h3>
            <p>Display your artwork in beautiful responsive galleries</p>
            <button>Design Gallery</button>
          </div>
          
          <div className="tool-card">
            <h3>Blog</h3>
            <p>Share your creative process with built-in blogging tools</p>
            <button>Start Blog</button>
          </div>
        </div>
      </div>
    </div>
  );
}