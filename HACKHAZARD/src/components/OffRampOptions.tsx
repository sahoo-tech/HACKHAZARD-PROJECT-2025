import './EarningsFinance.css';

export default function OffRampOptions() {
  return (
    <div className="earnings-finance">
      <h1>Off-ramp Options</h1>
      
      <div className="finance-card">
        <h2>Convert Funds</h2>
        <div className="finance-card-content">
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-value">3</div>
              <div className="stat-label">Available Methods</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">$5,000</div>
              <div className="stat-label">Monthly Limit</div>
            </div>
          </div>
          
          <div className="offramp-options">
            <h3>Conversion Methods</h3>
            <div className="option-list">
              {/* Off-ramp options would be listed here */}
              <div className="option-item">
                <span>Bank Transfer</span>
                <span>1-3 business days</span>
              </div>
              <div className="option-item">
                <span>Crypto Exchange</span>
                <span>Instant</span>
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