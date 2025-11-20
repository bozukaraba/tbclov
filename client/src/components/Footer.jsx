import React, { useState } from 'react';
import './Footer.css';

function Footer() {
  const [activeModal, setActiveModal] = useState(null);

  const narServices = [
    { id: 'spotify', name: 'NAR-Spotify', icon: '🎵' },
    { id: 'oyun', name: 'NAR-Oyun', icon: '🎮' },
    { id: 'forum', name: 'NAR-Forum', icon: '💬' },
    { id: 'bilet', name: 'NAR-Bilet', icon: '🎫' },
    { id: 'mezun', name: 'NAR-Mezun', icon: '🎓' },
    { id: 'dukkan', name: 'NAR-Dükkan', icon: '🛒' },
    { id: 'din', name: 'NAR-Din', icon: '🕌' },
    { id: 'activity', name: 'NAR-Activity', icon: '⚽' }
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
            {narServices.map(service => (
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
                {narServices.find(s => s.id === activeModal)?.icon} {' '}
                {narServices.find(s => s.id === activeModal)?.name}
              </h2>
              <button className="modal-close" onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              
              <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;
