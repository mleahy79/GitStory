import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './components/pages/Home';
import Analyze from './components/pages/Analyze';
import Login from './components/pages/Login';
import Chat from './components/pages/Chat';
import Document from './components/pages/Document';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App min-h-screen flex flex-col">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/document" element={<Document />} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
