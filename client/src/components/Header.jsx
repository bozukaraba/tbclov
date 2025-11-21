import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <img src="/nar-logo.png" alt="NAR Logo" className="logo-image" />
        </Link>
        
        <nav className="nav-menu">
          <Link to="/apply" className="nav-link btn-apply">
            Başvuru Yap
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
