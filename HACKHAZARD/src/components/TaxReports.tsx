import './EarningsFinance.css';

export default function TaxReports() {
  return (
    <div className="earnings-finance">
      <h1>Tax Reports</h1>
      
      <div className="finance-card">
        <h2>Tax Report Generator</h2>
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
          
          <div className="tax-form">
            <h3>Generate New Report</h3>
            <form>
              <div className="form-group">
                <label>Year</label>
                <select>
                  <option>2023</option>
                  <option>2022</option>
                  <option>2021</option>
                </select>
              </div>
              <div className="form-group">
                <label>Report Type</label>
                <select>
                  <option>Annual Summary</option>
                  <option>Quarterly</option>
                  <option>Custom Range</option>
                </select>
              </div>
              <button type="submit" className="action-button">
                Generate Report
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