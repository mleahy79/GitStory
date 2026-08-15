import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OnboardingProvider } from './context/OnboardingContext';
import { ToastProvider } from './context/ToastContext';
import { RepoProvider } from './context/RepoContext';
import ErrorBoundary from './components/shared/ErrorBoundary';
import LoadingSpinner from './components/shared/LoadingSpinner';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
// Home stays eager: it's the landing route for most visits, and lazy-loading
// it would trade a network waterfall for no real bundle-size win. Everything
// else — including Chat, which pulls in the heavy react-markdown/remark
// toolchain — is fetched on demand.
import Home from './components/pages/Home';
const Analyze = lazy(() => import('./components/pages/Analyze'));
const Login = lazy(() => import('./components/pages/Login'));
const Chat = lazy(() => import('./components/pages/Chat'));
const Document = lazy(() => import('./components/pages/Document'));
const Hotspots = lazy(() => import('./components/pages/Hotspots'));
const Branches = lazy(() => import('./components/pages/Branches'));
const Profile = lazy(() => import('./components/pages/Profile'));
const Settings = lazy(() => import('./components/pages/Settings'));
const Pricing = lazy(() => import('./components/pages/Pricing'));
const Privacy = lazy(() => import('./components/pages/Privacy'));
const Terms = lazy(() => import('./components/pages/Terms'));
const About = lazy(() => import('./components/pages/About'));
const NotFound = lazy(() => import('./components/pages/NotFound'));
const OnboardingPage = lazy(() => import('./components/pages/onboarding/OnboardingPage'));
const TrialPage = lazy(() => import('./components/pages/trial/TrialPage'));

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
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/hotspots" element={<Hotspots />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/about" element={<About />} />
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
        </Suspense>
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
          <ToastProvider>
            <RepoProvider>
              <AppLayout />
            </RepoProvider>
          </ToastProvider>
        </OnboardingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
