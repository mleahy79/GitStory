import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { OnboardingProvider } from './context/OnboardingContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './components/pages/Home';
import Analyze from './components/pages/Analyze';
import Login from './components/pages/Login';
import Chat from './components/pages/Chat';
import Document from './components/pages/Document';
import Hotspots from './components/pages/Hotspots';
import OnboardingPage from './components/pages/onboarding/OnboardingPage';
import TrialPage from './components/pages/trial/TrialPage';

function AppLayout() {
  const location = useLocation();
  const isFunnel = location.pathname.startsWith('/onboarding') || location.pathname.startsWith('/trial');

  return (
    <div className="App min-h-screen flex flex-col">
      {!isFunnel && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/hotspots" element={<Hotspots />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/document" element={<Document />} />
        <Route path="/onboarding/:step" element={<OnboardingPage />} />
        <Route path="/trial/:step" element={<TrialPage />} />
      </Routes>
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
