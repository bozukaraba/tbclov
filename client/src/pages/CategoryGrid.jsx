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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProviders, setFeaturedProviders] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  
  // Yeni state'ler: Eyalet yönetimi için
  const [showStates, setShowStates] = useState(true);
  const [selectedState, setSelectedState] = useState(null);
  const [states, setStates] = useState([]);
  
  // Neden NAR Platform modal state
  const [showWhyNarModal, setShowWhyNarModal] = useState(false);

  // Eyalet verileri
  const usaStates = [
    'Arizona', 'California', 'Colorado', 'Connecticut', 'Florida', 
    'Georgia', 'Illinois', 'Indiana', 'Maryland', 'Massachusetts',
    'Michigan', 'New Jersey', 'New York', 'North Carolina', 'Ohio',
    'Pennsylvania', 'Texas', 'Virginia', 'Washington', 'Wisconsin'
  ];

  const canadaProvinces = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
    'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
    'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan',
    'Yukon'
  ];

  // Slider içerikleri
  const slides = [
    {
      title: 'Profesyonel Hizmet Sağlayıcıları',
      description: 'Güvenilir ve deneyimli hizmet sağlayıcılarıyla tanışın. İhtiyacınız olan her hizmet için en iyi profesyoneller burada!'
    },
    {
      title: 'Kaliteli ve Hızlı Hizmet',
      description: 'Bölgenizdeki en iyi hizmet sağlayıcılardan hızlıca teklif alın. 7/24 destek ve güvenli ödeme sistemi.'
    },
    {
      title: 'Her Kategoride Uzman Ekip',
      description: 'Badana, elektrik, tesisat, temizlik ve daha fazlası. Aradığınız hizmeti kolayca bulun ve iletişime geçin.'
    }
  ];

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
    // Ülkeye göre eyaletleri ayarla
    if (country === 'USA') {
      setStates(usaStates);
    } else if (country === 'Canada') {
      setStates(canadaProvinces);
    }
    
    // Ülke değiştiğinde eyalet seçimini sıfırla
    setShowStates(true);
    setSelectedState(null);
    fetchCategories();
  }, [country]);

  useEffect(() => {
    // Eyalet seçildikten sonra featured providers'ı yükle
    if (selectedState) {
      fetchFeaturedProviders();
    }
  }, [selectedState, country]);

  // Slider otomatik geçiş
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

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

  const fetchFeaturedProviders = async () => {
    if (!selectedState) return;
    
    setLoadingFeatured(true);
    try {
      const params = new URLSearchParams({
        approved: 'true',
        country: country,
        state: selectedState
      });

      const response = await fetch(`/api/providers?${params}`);
      if (response.ok) {
        const data = await response.json();
        // Son eklenen 10 profesyoneli al
        const sortedData = data.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        });
        setFeaturedProviders(sortedData.slice(0, 10));
      } else {
        setFeaturedProviders([]);
      }
    } catch (error) {
      console.error('Featured providers yüklenemedi:', error);
      setFeaturedProviders([]);
    } finally {
      setLoadingFeatured(false);
    }
  };

  const handleStateClick = (state) => {
    setSelectedState(state);
    setShowStates(false);
  };

  const handleBackToStates = () => {
    setShowStates(true);
    setSelectedState(null);
    setFeaturedProviders([]);
  };

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setShowModal(true);
    setLoading(true);
    
    try {
      const params = new URLSearchParams({
        category: category,
        country: country,
        state: selectedState,
        approved: 'true'
      });
      
      const response = await fetch(`/api/providers?${params}`);
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

  const handleViewAllProviders = () => {
    navigate(`/providers?country=${country}&state=${selectedState}`);
  };

  const handleProviderClick = (providerId) => {
    navigate(`/provider/${providerId}`);
  };

  return (
    <div className="category-grid-container">
      {/* Hero Slider - Sadece kategoriler sayfasında göster */}
      {!showStates && (
        <div className="hero-slider">
          <div className="slider-container">
            <div 
              className="slider-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div key={index} className="slider-slide">
                  <div className="slide-content">
                    <h2>{slide.title}</h2>
                    <p>{slide.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="slider-nav prev" onClick={prevSlide}>
              ‹
            </button>
            <button className="slider-nav next" onClick={nextSlide}>
              ›
            </button>
            
            <div className="slider-dots">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`slider-dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Neden NAR Platform Butonu */}
      {!showStates && (
        <div className="why-nar-section">
          <button className="why-nar-btn" onClick={() => setShowWhyNarModal(true)}>
            <span className="why-nar-icon">💡</span>
            Neden NAR Platform?
          </button>
        </div>
      )}

      {/* Eyalet Seçimi veya Kategoriler */}
      {showStates ? (
        <div>
          <div className="category-header">
            <h1>
              {country === 'USA' ? '🇺🇸 Amerika' : country === 'Canada' ? '🇨🇦 Kanada' : ''} 
              {' '}Eyalet Seçimi
            </h1>
            <p>Hizmet almak istediğiniz eyaleti seçin</p>
          </div>

          <div className="categories-grid">
            {states.map((state) => (
              <div
                key={state}
                className="category-card state-card"
                onClick={() => handleStateClick(state)}
              >
                <div className="category-icon">
                  📍
                </div>
                <h3 className="category-title">{state}</h3>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="category-header">
            <button className="back-button" onClick={handleBackToStates}>
              ← Eyalet Seçimine Dön
            </button>
            <h1>
              {country === 'USA' ? '🇺🇸' : '🇨🇦'} {selectedState} - Hizmet Kategorileri
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

          {/* Featured Providers Section */}
          <div className="featured-section">
            <div className="featured-header">
              <h2>✨ Son Eklenen Profesyoneller</h2>
              <button className="view-all-btn" onClick={handleViewAllProviders}>
                Tümünü Gör →
              </button>
            </div>

            {loadingFeatured ? (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            ) : featuredProviders.length > 0 ? (
              <>
                <div className="featured-scroll-container">
                  <div className="featured-providers">
                    {featuredProviders.map((provider) => (
                      <div
                        key={provider._id}
                        className="featured-card"
                        onClick={() => handleProviderClick(provider._id)}
                      >
                        <div className="featured-image">
                          {provider.image ? (
                            <img src={provider.image} alt={provider.name} />
                          ) : (
                            <div className="featured-image-placeholder">
                              {provider.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="featured-badge">YENİ</span>
                        </div>
                        <div className="featured-content">
                          <h3 className="featured-name">{provider.name}</h3>
                          <span className="featured-category">{provider.category}</span>
                          <p className="featured-service">{provider.service}</p>
                          <div className="featured-footer">
                            <span className="featured-location">
                              📍 {provider.serviceArea.split(',')[0]}
                            </span>
                            <div className="featured-rating">
                              <span className="featured-star">⭐</span>
                              <span className="featured-rating-value">4.8</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="scroll-indicator">
                  <span>← Kaydırın →</span>
                </div>
              </>
            ) : (
              <div className="no-providers">
                <p>Henüz profesyonel eklenmemiş.</p>
              </div>
            )}
          </div>
        </div>
      )}

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
              ) : (
                <div className="ad-invitation">
                  <div className="ad-invitation-content">
                    <h3>Reklamın burada görünmesini ister misin?</h3>
                    <button 
                      className="apply-now-btn"
                      onClick={() => {
                        closeModal();
                        navigate('/apply');
                      }}
                    >
                      Hemen Başvur
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Neden NAR Platform Modal */}
      {showWhyNarModal && (
        <div className="modal-overlay" onClick={() => setShowWhyNarModal(false)}>
          <div className="modal-content why-nar-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <span className="why-nar-modal-icon">💡</span> Neden NAR Platform?
              </h2>
              <button className="modal-close" onClick={() => setShowWhyNarModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="why-nar-content">
                <p>
                  Amerika ve Kanada'da yaşayan yüz binlerce kişiye ulaşmak artık çok kolay... 
                  Facebook, Instagram ve WhatsApp'ta yaptığınız paylaşımlar kaybolup giderken, 
                  <strong> NAR sayesinde yalnızca ulaşmak istediğiniz kişilere doğrudan erişebilirsiniz.</strong> 
                  Üstelik etkinliklerinizi paylaşarak erişiminizi kat kat artırabilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryGrid;
