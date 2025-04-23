import './CreatorStudio.css';
import { Link } from 'react-router-dom';

export default function BuilderTools() {
  const tools = [
    {
      title: 'AI Content Templates',
      description: 'Create zines, albums, NFTs, and digital exhibits with AI assistance',
      buttonText: 'Get Started'
    },
    {
      title: 'Website Builder',
      description: 'Chain-integrated website builder designed for creators',
      buttonText: 'Build Now'
    },
    {
      title: 'Podcast & Music Tools',
      description: 'One-click deployment for your audio content',
      buttonText: 'Deploy Content'
    },
    {
      title: 'DAO Setup',
      description: 'Modular DAO configuration for creative collectives',
      buttonText: 'Configure DAO'
    },
    {
      title: 'Licensing Templates',
      description: 'Customize and create your own licensing templates',
      buttonText: 'Create License'
    }
  ];

  return (
    <div className="builder-tools">
      <h1>Builder Tools & Templates</h1>
      
      <div className="tools-grid">
        {tools.map((tool, index) => (
          <div key={index} className="tool-card">
            <h3>{tool.title}</h3>
            <p>{tool.description}</p>
            <Link to={`/builder-tools/${tool.title.toLowerCase().replace(/\s+/g, '-')}`}>
  <button>{tool.buttonText}</button>
</Link>
          </div>
        ))}
      </div>
    </div>
  );
}