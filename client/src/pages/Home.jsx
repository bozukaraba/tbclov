import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home({ setSelectedCountry }) {
  const navigate = useNavigate();

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    navigate('/categories');
  };

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Profesyonel Hizmet Sağlayıcılar</h1>
          <p>Amerika ve Kanada'daki en iyi ustalar ve hizmet sağlayıcılarla tanışın</p>
          
          <div className="country-selection">
            <div className="country-card" onClick={() => handleCountrySelect('USA')}>
              <div className="country-info">
                <h2>🇺🇸 United States</h2>
                <p>Amerika'daki hizmet sağlayıcıları keşfedin</p>
              </div>
              <button className="view-btn">Hizmetleri Gör</button>
            </div>
            
            <div className="country-card" onClick={() => handleCountrySelect('Canada')}>
              <div className="country-info">
                <h2>🇨🇦 Canada</h2>
                <p>Kanada'daki hizmet sağlayıcıları keşfedin</p>
              </div>
              <button className="view-btn">Hizmetleri Gör</button>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Neden TBC Platform?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">✓</span>
            <h3>Güvenilir Hizmet</h3>
            <p>Tüm hizmet sağlayıcılar incelenir ve onaylanır</p>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <h3>Hızlı Erişim</h3>
            <p>İhtiyacınız olan hizmete anında ulaşın</p>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon">🎯</span>
            <h3>Bölgesel Hizmet</h3>
            <p>Bölgenize özel hizmet sağlayıcılar</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Hizmet Sağlayıcı mısınız?</h2>
        <p>Platformumuza katılın ve müşterilerinize ulaşın</p>
        <button 
          className="btn-cta"
          onClick={() => navigate('/apply')}
        >
          Hemen Başvurun
        </button>
      </section>
    </div>
  );
}

export default Home;
