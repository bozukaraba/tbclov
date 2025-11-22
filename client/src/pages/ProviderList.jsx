import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './ProviderList.css';

function ProviderList({ country }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    fetchProviders();
    fetchCategories();
  }, [country]);

  useEffect(() => {
    filterProviders();
  }, [providers, selectedCategory, searchTerm]);

  const fetchProviders = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        approved: 'true'
      });
      
      if (country) {
        params.append('country', country);
      }

      const response = await fetch(`/api/providers?${params}`);
      
      if (!response.ok) {
        throw new Error('API yanıt vermedi');
      }
      
      const data = await response.json();
      setProviders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Hizmet sağlayıcılar yüklenemedi:', error);
      setError('Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      setProviders([]);
    } finally {
      setLoading(false);
    }
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
        'Kişisel Antrenör',
        'Şef / Aşçıbaşı / Catering',
        'Driver (Şoför) Hizmetleri',
        'Çocuk & Yetişkin Bakıcılığı',
        'Ev Yemekleri',
        'Restoran Hizmetleri',
        'Mali Müşavir',
        'Doktor / Dişçi / Sağlık Danışmanı',
        'Terzi',
        'Fotoğrafçı',
        'Web Tasarımcısı',
        'Sosyal Medya Yönetimi',
        'Temizlik',
        'Ev İşleri',
        'Taşıma (Moving) Hizmetleri',
        'Pet-sitting',
        'Öğretmen',
        'Diğer'
      ]);
    }
  };

  const filterProviders = () => {
    let filtered = [...providers];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.serviceArea.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProviders(filtered);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p style={{ marginTop: '20px', color: '#6b7280' }}>Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="provider-list-container">
        <div className="alert alert-error">
          <h2>❌ Hata</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchProviders}>
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="provider-list-container">
      <div className="list-header">
        <h1>
          {country ? `${country === 'USA' ? '🇺🇸 Amerika' : '🇨🇦 Kanada'}` : 'Tüm'} Hizmet Sağlayıcılar
          {categoryFromUrl && ` - ${categoryFromUrl}`}
        </h1>
        <p>{filteredProviders.length} hizmet sağlayıcı bulundu</p>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="İsim, hizmet veya bölge ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="category-filters">
          <button
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            Tümü
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredProviders.length === 0 ? (
        <div className="no-results">
          <h2>Sonuç Bulunamadı</h2>
          <p>Arama kriterlerinize uygun hizmet sağlayıcı bulunamadı.</p>
        </div>
      ) : (
        <div className="providers-grid">
          {filteredProviders.map(provider => (
            <div 
              key={provider._id} 
              className="provider-card-new"
              onClick={() => navigate(`/provider/${provider._id}`)}
            >
              <div className="provider-card-image">
                {provider.image ? (
                  <img src={provider.image} alt={provider.name} />
                ) : (
                  <div className="provider-card-placeholder">
                    {provider.name.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="provider-card-content">
                <div className="provider-card-header">
                  <h3>{provider.name}</h3>
                  <span className="status-badge">Aktif</span>
                </div>
                
                <div className="provider-card-location">
                  📍 {provider.serviceArea}
                </div>
                
                <p className="provider-card-description">
                  {provider.description.length > 80 
                    ? provider.description.substring(0, 80) + '...' 
                    : provider.description}
                </p>
                
                <div className="provider-card-footer">
                  <div className="rating-badge">
                    <span className="star">⭐</span>
                    <span className="rating-number">4.8</span>
                    <span className="rating-reviews">(45)</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProviderList;
