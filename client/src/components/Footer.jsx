import React, { useState } from 'react';
import './Footer.css';

function Footer() {
  const [activeModal, setActiveModal] = useState(null);

  const narServices = [
    { id: 'spotify', name: 'NAR-Spotify', icon: '🎵' },
    { id: 'oyun', name: 'NAR-Oyun', icon: '🎮' },
    { id: 'forum', name: 'NAR-Forum', icon: '💬' },
    { id: 'bilet', name: 'NAR-Bilet', icon: '🎫' },
    { id: 'dukkan', name: 'NAR-Dükkan', icon: '🛒' },
    { id: 'din', name: 'NAR-Din', icon: '🕌' },
    { id: 'activity', name: 'NAR-Activity', icon: '⚽' },
    { id: 'kadin', name: 'NAR-Kadın', icon: '👩' },
    { id: 'instagram', name: 'NAR-Instagram', icon: '📸' },
    { id: 'seyahat', name: 'NAR-Seyahat', icon: '✈️' },
    { id: 'ilan', name: 'NAR-İlan', icon: '📋' }
  ];

  const openModal = (serviceId) => {
    setActiveModal(serviceId);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <div className="nar-services">
            {narServices.map(service => (
              <button
                key={service.id}
                className="nar-service-btn"
                onClick={() => openModal(service.id)}
              >
                <span className="service-icon">{service.icon}</span>
                <span className="service-name">{service.name}</span>
              </button>
            ))}
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 NAR. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {narServices.find(s => s.id === activeModal)?.icon} {' '}
                {narServices.find(s => s.id === activeModal)?.name}
              </h2>
              <button className="modal-close" onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p style={{ textAlign: 'center', fontSize: '24px', fontWeight: '600', padding: '40px 20px' }}>
                Yakında
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;
