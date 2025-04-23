import './EarningsFinance.css';

export default function RemittanceTools() {
  return (
    <div className="earnings-finance">
      <h1>Remittance Tools</h1>
      
      <div className="finance-card">
        <h2>Send Funds</h2>
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
          
          <div className="remittance-form">
            <h3>Send Funds</h3>
            <form>
              <div className="form-group">
                <label>Recipient Address</label>
                <input type="text" placeholder="Enter wallet address" />
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input type="number" placeholder="Enter amount" />
              </div>
              <button type="submit" className="action-button">
                Send Funds
              </button>
            </form>
          </div>
          
          <button className="action-button" onClick={() => window.history.back()}>
            Back to Finance Hub
          </button>
        </div>
      </div>
    </div>
  );
}