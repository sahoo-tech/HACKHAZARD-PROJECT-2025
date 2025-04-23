import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import CreatorUpload from './components/CreatorUpload'
import './components/CreatorUpload.css'
import NavigationMenu from './components/NavigationMenu'
import './components/NavigationMenu.css'
import CreatorStudio from './components/CreatorStudio'
import CollabVaults from './components/CollabVaults'
import DiscoverExplore from './components/DiscoverExplore'
import EarningsFinance from './components/EarningsFinance'
import IpImpactDashboard from './components/IpImpactDashboard'
import BuilderTools from './components/BuilderTools'
import RoyaltyTracker from './components/RoyaltyTracker'
import TipJarSubscriptions from './components/TipJarSubscriptions'
import RemittanceTools from './components/RemittanceTools'
import OffRampOptions from './components/OffRampOptions'
import TaxReports from './components/TaxReports'
import AIContentTemplates from './components/AIContentTemplates'
import WebsiteBuilder from './components/WebsiteBuilder'
import PodcastMusicTools from './components/PodcastMusicTools'
import DAOSetup from './components/DAOSetup'
import LicensingTemplates from './components/LicensingTemplates'

function App() {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <div className="app">
      <header className="app-header">
        <h1>ChainMuse</h1>
        <div className="header-buttons">
          <NavigationMenu />
          <button 
            className={`connect-button ${isConnected ? 'connected' : ''}`}
            onClick={() => setIsConnected(!isConnected)}
          >
            {isConnected ? 'Connected' : 'Connect Wallet'}
          </button>
        </div>
      </header>
      
      <main className="app-main">
        <Routes>
          <Route path="/" element={
            <>
              <section className="hero-section">
                <h2>Empower Creators with Blockchain Technology</h2>
                <p>A creative micro-patronage and royalty platform for musicians, artists, writers, developers, and educators.</p>
              </section>

              <section className="features-section">
                <div className="feature-card">
                  <h3>Tokenize Creative Works</h3>
                  <p>Convert your creative works into digital assets on the blockchain</p>
                </div>
                <div className="feature-card">
                  <h3>Real-time Royalties</h3>
                  <p>Receive fractional royalties instantly via smart contracts</p>
                </div>
                <div className="feature-card">
                  <h3>Global Micro-patronage</h3>
                  <p>Connect with supporters worldwide through fast, low-cost transactions</p>
                </div>
              </section>

              {isConnected && <CreatorUpload />}
            </>
          } />
          <Route path="/creator-studio" element={<CreatorStudio />} />
          <Route path="/collab-vaults" element={<CollabVaults />} />
          <Route path="/discover-explore" element={<DiscoverExplore />} />
          <Route path="/earnings-finance" element={<EarningsFinance />} />
          <Route path="/royalty-tracker" element={<RoyaltyTracker />} />
          <Route path="/tip-jar-subscriptions" element={<TipJarSubscriptions />} />
          <Route path="/remittance-tools" element={<RemittanceTools />} />
          <Route path="/off-ramp-options" element={<OffRampOptions />} />
          <Route path="/tax-reports" element={<TaxReports />} />
          <Route path="/ip-impact" element={<IpImpactDashboard />} />
          <Route path="/builder-tools" element={<BuilderTools />} />
<Route path="/builder-tools/ai-content-templates" element={<AIContentTemplates />} />
<Route path="/builder-tools/website-builder" element={<WebsiteBuilder />} />
<Route path="/builder-tools/podcast-music-tools" element={<PodcastMusicTools />} />
<Route path="/builder-tools/dao-setup" element={<DAOSetup />} />
<Route path="/builder-tools/licensing-templates" element={<LicensingTemplates />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
