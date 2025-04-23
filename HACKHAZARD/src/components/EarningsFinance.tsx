import './EarningsFinance.css';

export default function EarningsFinance() {

  return (
    <div className="earnings-finance">
      <h1>Earnings & Finance Hub</h1>
      
      <div className="finance-grid">
        <div className="finance-card">
          <h2>Royalty Tracker</h2>
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
            <button className="action-button" onClick={() => window.location.href='/royalty-tracker'}>
  View Details
</button>
          </div>
        </div>

        <div className="finance-card">
          <h2>Tip Jar & Subscriptions</h2>
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
            <button className="action-button" onClick={() => window.location.href='/tip-jar-subscriptions'}>
  Manage Subscriptions
</button>
          </div>
        </div>

        <div className="finance-card">
          <h2>Remittance Tools</h2>
          <div className="finance-card-content">
            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-value">24</div>
                <div className="stat-label">Connected Wallets</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">5</div>
                <div className="stat-label">Local Agents</div>
              </div>
            </div>
            <button className="action-button" onClick={() => window.location.href='/remittance-tools'}>
  Send Funds
</button>
          </div>
        </div>

        <div className="finance-card">
          <h2>Off-ramp Options</h2>
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
            <button className="action-button" onClick={() => window.location.href='/off-ramp-options'}>
  Convert Funds
</button>
          </div>
        </div>

        <div className="finance-card">
          <h2>Tax Reports</h2>
          <div className="finance-card-content">
            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-value">4</div>
                <div className="stat-label">Reports Generated</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">2023</div>
                <div className="stat-label">Current Year</div>
              </div>
            </div>
            <button className="action-button" onClick={() => window.location.href='/tax-reports'}>
  Generate Report
</button>
          </div>
        </div>
      </div>
    </div>
  );
}