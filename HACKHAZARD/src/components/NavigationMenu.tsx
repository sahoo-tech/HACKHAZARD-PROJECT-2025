import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="navigation-menu">
      <button className="menu-toggle" onClick={toggleMenu}>
        Menu
      </button>
      
      {isOpen && (
        <div className="menu-dropdown">
          <Link to="/creator-studio" className="menu-item">Creator Studio</Link>
          <Link to="/collab-vaults" className="menu-item">Collab Vaults</Link>
          <Link to="/discover-explore" className="menu-item">Discover & Explore</Link>
          <Link to="/earnings-finance" className="menu-item">Earnings & Finance Hub</Link>
          <Link to="/ip-impact" className="menu-item">IP & Impact Dashboard</Link>
          <Link to="/builder-tools" className="menu-item">Builder Tools & Templates</Link>
          <Link to="/ai-assistant" className="menu-item">AI Assistant</Link>
        </div>
      )}
    </div>
  );
}