import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProviderDetail.css';

function ProviderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProvider();
  }, [id]);

  const fetchProvider = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/providers/${id}`);
      
      if (!response.ok) {
        throw new Error('Hizmet sağlayıcı bulunamadı');
      }
      
      const data = await response.json();
      setProvider(data);
    } catch (error) {
      console.error('Detay yüklenemedi:', error);
      setError('Hizmet sağlayıcı bilgileri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p style={{ marginTop: '20px', color: '#6b7280' }}>Yükleniyor...</p>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="provider-detail-container">
        <div className="alert alert-error">
          <h2>❌ Hata</h2>
          <p>{error || 'Hizmet sağlayıcı bulunamadı'}</p>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  // Mock verdiği hizmetler - gerçekte provider.services array'inden gelecek
  const services = provider.services || [
    'İç Mekan Boya',
    'Dış Mekan Boya',
    'Duvar Kağıdı',
    'Dekoratif Boya'
  ];

  // Mock çalışma örnekleri - gerçekte provider.portfolio array'inden gelecek
  const portfolio = provider.portfolio || [];

  return (
    <div className="provider-detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Geri
      </button>

      <div className="detail-grid">
        {/* Sol Taraf - Ana Bilgiler */}
        <div className="main-info">
          <div className="provider-profile-card">
            <div className="profile-image-large">
              {provider.image ? (
                <img src={provider.image} alt={provider.name} />
              ) : (
                <div className="profile-placeholder">
                  {provider.name.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="profile-header">
              <h1>{provider.name}</h1>
              <p className="category-tag">{provider.category}</p>
            </div>

            <div className="profile-meta">
              <div className="meta-item">
                <span className="meta-icon">📍</span>
                <span>{provider.serviceArea}</span>
              </div>
              <div className="meta-item rating-display">
                <span className="star">⭐</span>
                <span className="rating-value">4.8</span>
                <span className="rating-count">(45 değerlendirme)</span>
              </div>
              <div className="experience-badge">
                15 yıl Tecrübe
              </div>
            </div>
          </div>

          {/* Hakkında */}
          <div className="detail-section">
            <h2>Hakkında</h2>
            <p className="about-text">{provider.description}</p>
          </div>

          {/* Verdiği Hizmetler */}
          <div className="detail-section">
            <h2>Verdiği Hizmetler</h2>
            <div className="services-tags">
              {services.map((service, index) => (
                <span key={index} className="service-tag">
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Çalışma Örnekleri */}
          {portfolio.length > 0 && (
            <div className="detail-section">
              <h2>Çalışma Örnekleri</h2>
              <div className="portfolio-grid">
                {portfolio.map((item, index) => (
                  <div key={index} className="portfolio-item">
                    <img src={item} alt={`Çalışma ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sağ Taraf - İletişim Bilgileri */}
        <div className="contact-sidebar">
          <div className="contact-card">
            <h3>İletişim Bilgileri</h3>
            
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div className="contact-info">
                <span className="contact-label">Telefon</span>
                <a href={`tel:${provider.phone}`} className="contact-value">
                  {provider.phone}
                </a>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <div className="contact-info">
                <span className="contact-label">Email</span>
                <a href={`mailto:${provider.email}`} className="contact-value">
                  {provider.email}
                </a>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-icon">🕐</span>
              <div className="contact-info">
                <span className="contact-label">Çalışma Saatleri</span>
                <span className="contact-value">
                  Pazartesi - Cumartesi: 08:00 - 18:00
                </span>
              </div>
            </div>

            <button className="btn btn-primary btn-large btn-call">
              Hemen Ara
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderDetail;
