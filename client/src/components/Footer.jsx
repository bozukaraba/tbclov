import React, { useState } from 'react';
import './Footer.css';

function Footer() {
  const [activeModal, setActiveModal] = useState(null);

  const tbcServices = [
    { id: 'spotify', name: 'TBC-Spotify', icon: '🎵' },
    { id: 'oyun', name: 'TBC-Oyun', icon: '🎮' },
    { id: 'forum', name: 'TBC-Forum', icon: '💬' },
    { id: 'bilet', name: 'TBC-Bilet', icon: '🎫' },
    { id: 'mezun', name: 'TBC-Mezun', icon: '🎓' },
    { id: 'dukkan', name: 'TBC-Dükkan', icon: '🛒' },
    { id: 'din', name: 'TBC-Din', icon: '🕌' },
    { id: 'activity', name: 'TBC-Activity', icon: '⚽' }
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
          <div className="tbc-services">
            {tbcServices.map(service => (
              <button
                key={service.id}
                className="tbc-service-btn"
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
                {tbcServices.find(s => s.id === activeModal)?.icon} {' '}
                {tbcServices.find(s => s.id === activeModal)?.name}
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
