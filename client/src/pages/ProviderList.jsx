import React, { useState, useEffect } from 'react';
import './ProviderList.css';

function ProviderList({ country }) {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProviders();
    fetchCategories();
  }, [country]);

  useEffect(() => {
    filterProviders();
  }, [providers, selectedCategory, searchTerm]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        approved: 'true'
      });
      
      if (country) {
        params.append('country', country);
      }

      const response = await fetch(`/api/providers?${params}`);
      const data = await response.json();
      setProviders(data);
    } catch (error) {
      console.error('Hizmet sağlayıcılar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
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
      </div>
    );
  }

  return (
    <div className="provider-list-container">
      <div className="list-header">
        <h1>
          {country ? `${country === 'USA' ? '🇺🇸 Amerika' : '🇨🇦 Kanada'}` : 'Tüm'} Hizmet Sağlayıcılar
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
            <div key={provider._id} className="provider-card">
              {provider.image && (
                <div className="provider-image">
                  <img src={provider.image} alt={provider.name} />
                </div>
              )}
              <div className="provider-content">
                <div className="provider-header">
                  <h3>{provider.name}</h3>
                  <span className="provider-badge">{provider.category}</span>
                </div>
                <h4 className="provider-service">{provider.service}</h4>
                <p className="provider-description">{provider.description}</p>
                <div className="provider-footer">
                  <div className="provider-location">
                    📍 {provider.serviceArea}
                  </div>
                  <div className="provider-contact">
                    <a href={`tel:${provider.phone}`} className="contact-btn phone">
                      📞 Ara
                    </a>
                    <a href={`mailto:${provider.email}`} className="contact-btn email">
                      ✉️ Email
                    </a>
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
