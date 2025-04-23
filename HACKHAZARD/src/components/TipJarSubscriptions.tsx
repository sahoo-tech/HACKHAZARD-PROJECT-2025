import './EarningsFinance.css';

export default function TipJarSubscriptions() {
  return (
    <div className="earnings-finance">
      <h1>Tip Jar & Subscriptions</h1>
      
      <div className="finance-card">
        <h2>Subscription Management</h2>
        <div className="finance-card-content">
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-value">156</div>
              <div className="stat-label">Active Subscribers</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">$890</div>
              <div className="stat-label">Monthly Revenue</div>
            </div>
          </div>
          
          <div className="subscription-details">
            <h3>Subscription Plans</h3>
            <div className="subscription-list">
              {/* Subscription items would be mapped here */}
              <div className="subscription-item">
                <span>Basic Plan</span>
                <span>$5/month</span>
              </div>
              <div className="subscription-item">
                <span>Premium Plan</span>
                <span>$15/month</span>
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