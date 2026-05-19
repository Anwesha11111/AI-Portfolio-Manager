import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/useAuthStore';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Market from './pages/Market';
import AssetDetails from './pages/AssetDetails';
import Analysis from './pages/Analysis';
import Academy from './pages/Academy';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import LessonView from './pages/LessonView';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore();
  
  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  return children;
};



function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/market" element={<Market />} />
        <Route path="/market/:symbol" element={<AssetDetails />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/academy/:id" element={<LessonView />} />
      </Route>
    </Routes>
  );
}

export default App;
