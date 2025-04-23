import { useState } from 'react';
import './CollabVaults.css';

export default function CollabVaults() {
  const [activeTab, setActiveTab] = useState('revenue');

  return (
    <div className="collab-vaults">
      <h1>Collab Vaults</h1>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'revenue' ? 'active' : ''}`}
          onClick={() => setActiveTab('revenue')}
        >
          Revenue Shares
        </button>
        <button 
          className={`tab ${activeTab === 'version' ? 'active' : ''}`}
          onClick={() => setActiveTab('version')}
        >
          Version Control
        </button>
        <button 
          className={`tab ${activeTab === 'contracts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contracts')}
        >
          Smart Contracts
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Collaboration Settings
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'revenue' && (
          <div className="revenue-shares">
            <h2>Revenue Share Management</h2>
            <div className="invite-form">
              <input type="email" placeholder="Collaborator's email" />
              <input type="number" placeholder="Revenue share %" min="0" max="100" />
              <button className="invite-btn">Invite Collaborator</button>
            </div>
            <div className="collaborators-list">
              <h3>Current Collaborators</h3>
              {/* Placeholder for collaborators list */}
            </div>
          </div>
        )}

        {activeTab === 'version' && (
          <div className="version-control">
            <h2>Timeline Version Control</h2>
            <div className="version-timeline">
              {/* Placeholder for version timeline */}
              <div className="timeline-entry">
                <span className="timestamp">Today 2:30 PM</span>
                <span className="event">Updated main composition</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="smart-contracts">
            <h2>Creative Agreements</h2>
            <div className="contract-templates">
              <button className="template-btn">Revenue Share Agreement</button>
              <button className="template-btn">Collaboration Terms</button>
              <button className="template-btn">License Agreement</button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="collab-settings">
            <h2>Collaboration Settings</h2>
            <div className="visibility-toggle">
              <label>
                <input type="checkbox" /> Make Project Public
              </label>
              <p>Public projects are visible to all users</p>
            </div>
            <div className="contribution-events">
              <h3>Recent Contributions</h3>
              <div className="event-log">
                {/* Placeholder for contribution events */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}