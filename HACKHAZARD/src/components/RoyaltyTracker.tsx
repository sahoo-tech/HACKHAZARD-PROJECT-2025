import './EarningsFinance.css';

export default function RoyaltyTracker() {
  return (
    <div className="earnings-finance">
      <h1>Royalty Tracker</h1>
      
      <div className="finance-card">
        <h2>Detailed Royalty Information</h2>
        <div className="finance-card-content">
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-value">$2,450</div>
              <div className="stat-label">Total Earnings</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">12</div>
              <div className="stat-label">Active Projects</div>
            </div>
          </div>
          
          <div className="royalty-details">
            <h3>Project Breakdown</h3>
            <div className="royalty-list">
              {/* Royalty items would be mapped here */}
              <div className="royalty-item">
                <span>Project Name</span>
                <span>$450</span>
              </div>
              <div className="royalty-item">
                <span>Project Name</span>
                <span>$200</span>
              </div>
            </div>
          </div>
          
          <button className="action-button" onClick={() => window.history.back()}>
            Back to Finance Hub
          </button>
        </div>
      </div>
    </div>
  );
}