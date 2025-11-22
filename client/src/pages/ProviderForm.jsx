import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProviderForm.css';

function ProviderForm({ country }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    category: '',
    description: '',
    serviceArea: '',
    country: country || 'USA',
    image: null,
    professionalDesign: false
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (country) {
      setFormData(prev => ({ ...prev, country }));
    }
  }, [country]);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Şimdilik Firebase olmadan çalışması için basit bir response
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch('/api/providers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Başvuru gönderilemedi');
      }

      const data = await response.json();

      setMessage({ type: 'success', text: data.message || 'Başvurunuz alındı! Onay sonrası listelenecektir.' });
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        category: '',
        description: '',
        serviceArea: '',
        country: country || 'USA',
        image: null,
        professionalDesign: false
      });
      
      // 3 saniye sonra anasayfaya yönlendir
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error('Başvuru hatası:', error);
      setMessage({ 
        type: 'error', 
        text: 'Başvurunuz şu anda gönderilemedi. Firebase bağlantısı yapılandırılıyor. Lütfen daha sonra tekrar deneyin.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Hizmet Sağlayıcı Başvurusu</h1>
        <p>Bilgilerinizi doldurun, onay sonrası hizmetiniz yayınlanacaktır.</p>
      </div>

      {/* Fiyatlandırma Bilgisi */}
      <div className="pricing-info">
        <div className="pricing-card">
          <div className="pricing-icon">💳</div>
          <h3>Ücretsiz Başvuru</h3>
          <p className="pricing-desc">
            Temel profil oluşturma ve listeleme hizmeti ücretsizdir. 
            Başvurunuz onaylandıktan sonra hizmetiniz platformda yayınlanacaktır.
          </p>
        </div>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="provider-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">İsim Soyisim *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="Adınız ve soyadınız"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="ornek@email.com"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Telefon *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="+1 234 567 8900"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ülke *</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="USA">🇺🇸 USA</option>
              <option value="Canada">🇨🇦 Canada</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Hizmet Kategorisi *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Kategori Seçin</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Hizmet Adı *</label>
            <input
              type="text"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="Örn: Profesyonel Boya Badana"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Hizmet Bölgesi *</label>
          <input
            type="text"
            name="serviceArea"
            value={formData.serviceArea}
            onChange={handleChange}
            className="form-input"
            required
            placeholder="Örn: New York, Manhattan, Brooklyn"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Hizmet Açıklaması *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            required
            placeholder="Verdiğiniz hizmetler hakkında detaylı bilgi verin..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Profil Fotoğrafı / Reklam Görseli</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="form-input"
            accept="image/*"
          />
          <div className="image-upload-info">
            <p className="info-text">
              📸 <strong>Profil Fotoğrafı/Logo kısmına reklam görselinizi ekleyin.</strong>
            </p>
            <p className="info-text">
              🤖 İsterseniz AI ile görsel oluşturabilir ya da aşağıdaki seçenekle 
              <strong> 10$ karşılığında profesyonel ekibimizden destek alabilirsiniz.</strong>
            </p>
          </div>
          <small className="form-help">Maksimum 5MB, JPG, PNG veya GIF formatında</small>
        </div>

        {/* Profesyonel Tasarım Desteği Seçeneği */}
        <div className="form-group">
          <div className="professional-design-option">
            <div className="design-option-header">
              <input
                type="checkbox"
                id="professionalDesign"
                name="professionalDesign"
                checked={formData.professionalDesign}
                onChange={handleChange}
                className="design-checkbox"
              />
              <label htmlFor="professionalDesign" className="design-label">
                <span className="design-title">🎨 Profesyonel Tasarım Desteği</span>
                <span className="design-price">+10$</span>
              </label>
            </div>
            <div className="design-description">
              <p>
                Profesyonel ekibimiz sizin için özel reklam görseli tasarlayacak. 
                Markanıza uygun, dikkat çekici ve profesyonel bir görsel ile öne çıkın!
              </p>
              <ul className="design-features">
                <li>✓ Özel tasarım görseli</li>
                <li>✓ Markanıza özel renk ve stil</li>
                <li>✓ 2 revizyon hakkı</li>
                <li>✓ 24 saat içinde teslim</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Toplam Tutar Gösterimi */}
        {formData.professionalDesign && (
          <div className="payment-summary">
            <div className="summary-row">
              <span>Başvuru Ücreti:</span>
              <span className="free-tag">ÜCRETSİZ</span>
            </div>
            <div className="summary-row">
              <span>Profesyonel Tasarım Desteği:</span>
              <span>$10.00</span>
            </div>
            <div className="summary-total">
              <span>Toplam:</span>
              <span className="total-amount">$10.00</span>
            </div>
            <p className="payment-note">
              💳 Ödeme, başvurunuz onaylandıktan sonra email ile gönderilecek 
              güvenli ödeme bağlantısı üzerinden yapılacaktır.
            </p>
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary btn-large"
          disabled={loading}
        >
          {loading ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}
        </button>
      </form>
    </div>
  );
}

export default ProviderForm;
