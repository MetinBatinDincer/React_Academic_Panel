import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/adminNewAdvert.css';

function Admin_new_advert() {
  const [formData, setFormData] = useState({
    baslik: '',
    aciklama: '',
    kategori: '',
    baslangic_tarihi: '',
    bitis_tarihi: ''
  });
  const [selectedDocTypes, setSelectedDocTypes] = useState([]);
  const [availableDocTypes, setAvailableDocTypes] = useState([]);
  const [newDocTypeName, setNewDocTypeName] = useState('');
  const [showNewDocInput, setShowNewDocInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => setProfile(response.data))
      .catch(err => console.error('Profil çekilemedi:', err));
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/belge_turleri', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => setAvailableDocTypes(response.data))
    .catch(err => console.error('Belge türleri çekilemedi:', err));
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleDocTypeSelect = (e) => {
    const selectedValue = parseInt(e.target.value);
    if (selectedValue && !selectedDocTypes.includes(selectedValue)) {
      setSelectedDocTypes([...selectedDocTypes, selectedValue]);
    }
  };

  const handleRemoveDocType = (docTypeId) => {
    setSelectedDocTypes(selectedDocTypes.filter(id => id !== docTypeId));
  };

  const handleAddNewDocType = async () => {
    if (newDocTypeName.trim() === '') {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/belge_turleri', 
        { tur: newDocTypeName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAvailableDocTypes([...availableDocTypes, response.data]);
      setNewDocTypeName('');
      setShowNewDocInput(false);
    } catch (err) {
      console.error('Yeni belge türü eklenemedi:', err);
      setError('Yeni belge türü eklenemedi.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token');

    const dataToSend = { ...formData, requiredDocuments: selectedDocTypes };

    try {
      const response = await axios.post('http://localhost:5000/api/admin/ilanlar', dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('İlan eklendi:', response.data);
      setSuccess('İlan başarıyla eklendi.');
      setFormData({
        baslik: '',
        aciklama: '',
        kategori: '',
        baslangic_tarihi: '',
        bitis_tarihi: ''
      });
      setSelectedDocTypes([]);
    } catch (err) {
      const errorMsg = err.response ? err.response.data.error || err.response.data : err.message;
      console.error('İlan eklenirken hata:', errorMsg);
      setError(`İlan eklenirken hata oluştu: ${errorMsg}`);
    }
    setLoading(false);
  };

  return (
    <div className="new-advert-container">
      <h2>Yeni İlan Ekle</h2>
      <form onSubmit={handleSubmit} className="new-advert-form">
        <div className="form-group">
          <label>Başlık</label>
          <input
            type="text"
            name="baslik"
            value={formData.baslik}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Açıklama</label>
          <textarea
            name="aciklama"
            value={formData.aciklama}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Kategori</label>
          <input
            type="text"
            name="kategori"
            value={formData.kategori}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Başlangıç Tarihi</label>
          <input
            type="date"
            name="baslangic_tarihi"
            value={formData.baslangic_tarihi}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Bitiş Tarihi</label>
          <input
            type="date"
            name="bitis_tarihi"
            value={formData.bitis_tarihi}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Yeni Belge Türü Ekle</label>
          {showNewDocInput ? (
            <div className="new-doc-type-input">
              <input
                type="text"
                value={newDocTypeName}
                onChange={(e) => setNewDocTypeName(e.target.value)}
                placeholder="Belge türü adını girin"
              />
              <button type="button" className="small-btn" onClick={handleAddNewDocType}>Ekle</button>
              <button type="button" className="small-btn cancel" onClick={() => setShowNewDocInput(false)}>İptal</button>
            </div>
          ) : (
            <button type="button" className="toggle-new-doc-btn" onClick={() => setShowNewDocInput(true)}>
              Belge Ekle
            </button>
          )}
        </div>

        <div className="form-group">
          <label>Gerekli Belge Türleri</label>
          <select onChange={handleDocTypeSelect}>
            <option value="">Belge Türü Seçin</option>
            {availableDocTypes.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.tur}
              </option>
            ))}
          </select>
          {selectedDocTypes.length > 0 && (
            <ul className="document-list">
              {selectedDocTypes.map((docId) => {
                const docType = availableDocTypes.find(dt => dt.id === docId);
                return (
                  <li key={docId}>
                    <span>{docType ? docType.tur : ''}</span>
                    <button type="button" className="delete-btn" onClick={() => handleRemoveDocType(docId)}>
                      🗑️
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Gönderiliyor...' : 'İlanı Ekle'}
        </button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
}

export default Admin_new_advert;