import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

function AdminPanel() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // 'pending', 'approved', 'all'

  useEffect(() => {
    fetchProviders();
  }, [filter]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (filter === 'pending') {
        params.append('approved', 'false');
      } else if (filter === 'approved') {
        params.append('approved', 'true');
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

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`/api/providers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ approved: true })
      });

      if (response.ok) {
        alert('Başvuru onaylandı!');
        fetchProviders();
      }
    } catch (error) {
      console.error('Onaylama hatası:', error);
      alert('Bir hata oluştu!');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/providers/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Kayıt silindi!');
        fetchProviders();
      }
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Bir hata oluştu!');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-panel-container">
      <div className="admin-header">
        <h1>🛠️ Yönetim Paneli</h1>
        <p>Hizmet sağlayıcı başvurularını yönetin</p>
      </div>

      <div className="admin-filters">
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Bekleyen ({providers.filter(p => !p.approved).length})
        </button>
        <button
          className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Onaylanan
        </button>
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Tümü
        </button>
      </div>

      {providers.length === 0 ? (
        <div className="no-results">
          <h2>Kayıt Bulunamadı</h2>
          <p>Bu kategoride görüntülenecek kayıt bulunmuyor.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Görsel</th>
                <th>İsim</th>
                <th>Hizmet</th>
                <th>Kategori</th>
                <th>Bölge</th>
                <th>Ülke</th>
                <th>İletişim</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {providers.map(provider => (
                <tr key={provider._id} className={provider.approved ? 'approved-row' : 'pending-row'}>
                  <td>
                    {provider.image ? (
                      <img src={provider.image} alt={provider.name} className="table-image" />
                    ) : (
                      <div className="no-image">📷</div>
                    )}
                  </td>
                  <td>
                    <strong>{provider.name}</strong>
                  </td>
                  <td>{provider.service}</td>
                  <td>
                    <span className="category-badge">{provider.category}</span>
                  </td>
                  <td>{provider.serviceArea}</td>
                  <td>
                    <span className="country-flag">
                      {provider.country === 'USA' ? '🇺🇸' : '🇨🇦'}
                    </span>
                  </td>
                  <td className="contact-cell">
                    <div>{provider.phone}</div>
                    <div className="email-text">{provider.email}</div>
                  </td>
                  <td>
                    {provider.approved ? (
                      <span className="status-badge approved">✓ Onaylı</span>
                    ) : (
                      <span className="status-badge pending">⏳ Bekliyor</span>
                    )}
                  </td>
                  <td className="actions-cell">
                    {!provider.approved && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleApprove(provider._id)}
                      >
                        Onayla
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(provider._id)}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
