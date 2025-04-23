
import { Routes, Route } from 'react-router-dom';
import AIInterface from '../components/AIInterface';
import CreatorStudio from '../components/CreatorStudio';
import CollabVaults from '../components/CollabVaults';
import DiscoverExplore from '../components/DiscoverExplore';
import EarningsFinance from '../components/EarningsFinance';
import IpImpactDashboard from '../components/IpImpactDashboard';
import BuilderTools from '../components/BuilderTools';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/creator-studio" element={<CreatorStudio />} />
      <Route path="/collab-vaults" element={<CollabVaults />} />
      <Route path="/discover-explore" element={<DiscoverExplore />} />
      <Route path="/earnings-finance" element={<EarningsFinance />} />
      <Route path="/ip-impact" element={<IpImpactDashboard />} />
      <Route path="/builder-tools" element={<BuilderTools />} />
      <Route path="/ai-assistant" element={<AIInterface />} />
    </Routes>
  );
};

export default AppRoutes;