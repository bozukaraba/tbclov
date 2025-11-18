import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ selectedCountry, setSelectedCountry }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="country-buttons">
          <button
            className={`country-btn ${selectedCountry === 'USA' ? 'active' : ''}`}
            onClick={() => setSelectedCountry('USA')}
          >
            🇺🇸 USA
          </button>
          <button
            className={`country-btn ${selectedCountry === 'Canada' ? 'active' : ''}`}
            onClick={() => setSelectedCountry('Canada')}
          >
            🇨🇦 Canada
          </button>
        </div>
        
        <Link to="/" className="logo">
          <h1>TBC</h1>
          <p>Platform</p>
        </Link>
        
        <nav className="nav-menu">
          <Link to="/categories" className="nav-link">
            Hizmet Sağlayıcılar
          </Link>
          <Link to="/apply" className="nav-link btn-apply">
            Başvuru Yap
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
