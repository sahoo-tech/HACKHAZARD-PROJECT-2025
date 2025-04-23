import { useState } from 'react';
import './DiscoverExplore.css';

export default function DiscoverExplore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const trendingContent = [
    { id: 1, title: 'Top Creator Insights', views: '10K', creator: 'CreativeMinds' },
    { id: 2, title: 'Digital Art Collection', views: '8.5K', creator: 'ArtisticSoul' },
    { id: 3, title: 'Web3 Development Guide', views: '15K', creator: 'TechPro' },
  ];

  const categories = ['all', 'art', 'music', 'technology', 'gaming', 'education'];

  const recommendedCreators = [
    { id: 1, name: 'CreativeMinds', followers: '100K', category: 'art' },
    { id: 2, name: 'TechPro', followers: '75K', category: 'technology' },
    { id: 3, name: 'MusicMaster', followers: '50K', category: 'music' },
  ];

  return (
    <div className="discover-explore">
      <section className="search-section">
        <h1>Discover & Explore</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search content, creators, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </section>

      <section className="trending-section">
        <h2>Trending Now</h2>
        <div className="trending-grid">
          {trendingContent.map((content) => (
            <div key={content.id} className="trending-card">
              <h3>{content.title}</h3>
              <p className="views">{content.views} views</p>
              <p className="creator">By {content.creator}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="recommended-creators">
        <h2>Recommended Creators</h2>
        <div className="creators-grid">
          {recommendedCreators.map((creator) => (
            <div key={creator.id} className="creator-card">
              <h3>{creator.name}</h3>
              <p className="followers">{creator.followers} followers</p>
              <p className="category">{creator.category}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}