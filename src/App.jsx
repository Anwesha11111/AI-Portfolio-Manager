import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Market from './pages/Market';
import AssetDetails from './pages/AssetDetails';
import Analysis from './pages/Analysis';
import Landing from './pages/Landing';

// Placeholder for Academy
const Academy = () => <div style={{padding: '2rem'}}><h1>Academy</h1><p>Learn the market mechanics here.</p></div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/market" element={<Market />} />
        <Route path="/market/:symbol" element={<AssetDetails />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/academy" element={<Academy />} />
      </Route>
    </Routes>
  );
}

export default App;
