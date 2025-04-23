import { useState } from 'react';
import './IpImpactDashboard.css';

export default function IpImpactDashboard() {
  const [activeTab, setActiveTab] = useState('portfolio');

  return (
    <div className="ip-impact-dashboard">
      <h1>IP & Impact Dashboard</h1>
      
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveTab('portfolio')}
        >
          IP Portfolio
        </button>
        <button 
          className={`tab-button ${activeTab === 'metrics' ? 'active' : ''}`}
          onClick={() => setActiveTab('metrics')}
        >
          Impact Metrics
        </button>
        <button 
          className={`tab-button ${activeTab === 'licensing' ? 'active' : ''}`}
          onClick={() => setActiveTab('licensing')}
        >
          Licensing Status
        </button>
        <button 
          className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'portfolio' && (
          <div className="portfolio-section">
            <h2>IP Portfolio Management</h2>
            <div className="metrics-grid">
              <div className="metric-card">
                <h3>Total Assets</h3>
                <p className="metric-value">24</p>
              </div>
              <div className="metric-card">
                <h3>Pending Applications</h3>
                <p className="metric-value">3</p>
              </div>
              <div className="metric-card">
                <h3>Active Licenses</h3>
                <p className="metric-value">12</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="metrics-section">
            <h2>Impact Analytics</h2>
            <div className="metrics-grid">
              <div className="metric-card">
                <h3>Total Views</h3>
                <p className="metric-value">45.2K</p>
              </div>
              <div className="metric-card">
                <h3>Engagement Rate</h3>
                <p className="metric-value">8.7%</p>
              </div>
              <div className="metric-card">
                <h3>Revenue Generated</h3>
                <p className="metric-value">$12.4K</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'licensing' && (
          <div className="licensing-section">
            <h2>License Management</h2>
            <div className="license-list">
              <div className="license-item">
                <h3>Premium Content License</h3>
                <p>Status: Active</p>
                <p>Revenue Share: 70%</p>
              </div>
              <div className="license-item">
                <h3>Commercial Usage Rights</h3>
                <p>Status: Pending Review</p>
                <p>Revenue Share: 60%</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-section">
            <h2>Analytics Reports</h2>
            <div className="report-list">
              <div className="report-item">
                <h3>Monthly Performance</h3>
                <button className="download-button">Download PDF</button>
              </div>
              <div className="report-item">
                <h3>Revenue Analysis</h3>
                <button className="download-button">Download PDF</button>
              </div>
              <div className="report-item">
                <h3>Engagement Metrics</h3>
                <button className="download-button">Download PDF</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}