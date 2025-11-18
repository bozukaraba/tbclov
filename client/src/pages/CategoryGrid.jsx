import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryGrid.css';

function CategoryGrid({ country }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Kategori icon mapping
  const categoryIcons = {
    'Badana & Boya': '🎨',
    'Avukat': '⚖️',
    'Web Tasarımcı': '💻',
    'Tadilat & Tamirat': '🔧',
    'Elektrikçi': '⚡',
    'Tesisat': '🔧',
    'Temizlik': '🧹',
    'Nakliyat': '🚚',
    'Bahçe Bakımı': '🌳',
    'Emlak': '🏠',
    'Fotoğrafçılık': '📷',
    'Danışmanlık': '👤',
    'Diğer Hizmetler': '🧳',
    'Diğer': '🧳'
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        throw new Error('Kategoriler yüklenemedi');
      }
      
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
      // Fallback kategoriler
      setCategories([
        'Badana & Boya',
        'Avukat',
        'Web Tasarımcı',
        'Tadilat & Tamirat',
        'Elektrikçi',
        'Tesisat',
        'Temizlik',
        'Nakliyat',
        'Bahçe Bakımı',
        'Emlak',
        'Fotoğrafçılık',
        'Danışmanlık',
        'Diğer Hizmetler'
      ]);
    }
  };

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setShowModal(true);
    setLoading(true);
    
    try {
      const response = await fetch(`/api/providers?category=${encodeURIComponent(category)}&country=${country}&approved=true`);
      if (response.ok) {
        const data = await response.json();
        setProviders(data);
      } else {
        setProviders([]);
      }
    } catch (error) {
      console.error('Hizmet sağlayıcılar yüklenemedi:', error);
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setProviders([]);
  };

  return (
    <div className="category-grid-container">
      <div className="category-header">
        <h1>
          {country === 'USA' ? '🇺🇸 Amerika' : country === 'Canada' ? '🇨🇦 Kanada' : ''} 
          {' '}Hizmet Kategorileri
        </h1>
        <p>Aradığınız hizmet kategorisini seçin</p>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <div
            key={category}
            className="category-card"
            onClick={() => handleCategoryClick(category)}
          >
            <div className="category-icon">
              {categoryIcons[category] || '📋'}
            </div>
            <h3 className="category-title">{category}</h3>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {categoryIcons[selectedCategory] || '📋'} {selectedCategory}
              </h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              {loading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Yükleniyor...</p>
                </div>
              ) : providers.length > 0 ? (
                <div className="providers-list">
                  {providers.map((provider) => (
                    <div 
                      key={provider._id} 
                      className="provider-item"
                      onClick={() => {
                        closeModal();
                        navigate(`/provider/${provider._id}`);
                      }}
                    >
                      <div className="provider-image">
                        {provider.image ? (
                          <img src={provider.image} alt={provider.name} />
                        ) : (
                          <div className="provider-placeholder">
                            {provider.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="provider-info">
                        <h3>{provider.name}</h3>
                        <p className="provider-service">{provider.service}</p>
                        <p className="provider-area">📍 {provider.serviceArea}</p>
                      </div>
                      <div className="provider-arrow">→</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-providers">
                  <p>Bu kategoride henüz hizmet sağlayıcı bulunmamaktadır.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryGrid;
