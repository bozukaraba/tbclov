import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home({ setSelectedCountry }) {
  const navigate = useNavigate();

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    navigate('/providers');
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">
          Profesyonel Hizmet Sağlayıcılar
        </h1>
        <p className="hero-subtitle">
          Amerika ve Kanada'daki en iyi ustalar ve hizmet sağlayıcılarla tanışın
        </p>
        
        <div className="country-select-cards">
          <div className="country-card" onClick={() => handleCountrySelect('USA')}>
            <div className="country-flag">🇺🇸</div>
            <h2>United States</h2>
            <p>Amerika'daki hizmet sağlayıcıları keşfedin</p>
            <button className="btn btn-primary">Hizmetleri Gör</button>
          </div>
          
          <div className="country-card" onClick={() => handleCountrySelect('Canada')}>
            <div className="country-flag">🇨🇦</div>
            <h2>Canada</h2>
            <p>Kanada'daki hizmet sağlayıcıları keşfedin</p>
            <button className="btn btn-primary">Hizmetleri Gör</button>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Neden TBC Platform?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">✓</div>
            <h3>Güvenilir Hizmet</h3>
            <p>Tüm hizmet sağlayıcılar incelenir ve onaylanır</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Hızlı Erişim</h3>
            <p>İhtiyacınız olan hizmete anında ulaşın</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Bölgesel Hizmet</h3>
            <p>Bölgenize özel hizmet sağlayıcılar</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Profesyonel Ekip</h3>
            <p>Uzman ve deneyimli hizmet sağlayıcılar</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Hizmet Sağlayıcı mısınız?</h2>
        <p>Platformumuza katılın ve müşterilerinize ulaşın</p>
        <button 
          className="btn btn-primary btn-large"
          onClick={() => navigate('/apply')}
        >
          Hemen Başvurun
        </button>
      </div>
    </div>
  );
}

export default Home;
