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
