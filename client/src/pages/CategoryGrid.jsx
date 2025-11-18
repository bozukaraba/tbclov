import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryGrid.css';

function CategoryGrid({ country }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

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

  const handleCategoryClick = (category) => {
    navigate(`/providers?category=${encodeURIComponent(category)}`);
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
    </div>
  );
}

export default CategoryGrid;
