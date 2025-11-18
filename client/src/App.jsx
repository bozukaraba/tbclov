import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProviderForm from './pages/ProviderForm';
import ProviderList from './pages/ProviderList';
import AdminPanel from './pages/AdminPanel';

function App() {
  const [selectedCountry, setSelectedCountry] = useState('USA');

  return (
    <Router>
      <div className="app">
        <Header 
          selectedCountry={selectedCountry} 
          setSelectedCountry={setSelectedCountry} 
        />
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={<Home setSelectedCountry={setSelectedCountry} />} 
            />
            <Route 
              path="/providers" 
              element={<ProviderList country={selectedCountry} />} 
            />
            <Route 
              path="/apply" 
              element={<ProviderForm country={selectedCountry} />} 
            />
            <Route 
              path="/admin" 
              element={<AdminPanel />} 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
