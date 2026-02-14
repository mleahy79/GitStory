import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OnboardingProvider } from './context/OnboardingContext';
import ErrorBoundary from './components/shared/ErrorBoundary';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './components/pages/Home';
import Analyze from './components/pages/Analyze';
import Login from './components/pages/Login';
import Chat from './components/pages/Chat';
import Document from './components/pages/Document';
import Hotspots from './components/pages/Hotspots';
import Profile from './components/pages/Profile';
import Settings from './components/pages/Settings';
import Pricing from './components/pages/Pricing';
import Privacy from './components/pages/Privacy';
import Terms from './components/pages/Terms';
import NotFound from './components/pages/NotFound';
import OnboardingPage from './components/pages/onboarding/OnboardingPage';
import TrialPage from './components/pages/trial/TrialPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1828] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#178582]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppLayout() {
  const location = useLocation();
  const isFunnel = location.pathname.startsWith('/onboarding') || location.pathname.startsWith('/trial');

  return (
    <div className="App min-h-screen flex flex-col">
      {!isFunnel && <Navbar />}
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/hotspots" element={<Hotspots />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/document" element={<ProtectedRoute><Document /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/onboarding/:step" element={<OnboardingPage />} />
          <Route path="/trial/:step" element={<TrialPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
      {!isFunnel && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OnboardingProvider>
          <AppLayout />
        </OnboardingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
