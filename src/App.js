import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './components/pages/Home';
import Analyze from './components/pages/Analyze';

function App() {
  return (
    <BrowserRouter>
      <div className="App min-h-screen flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<Analyze />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
