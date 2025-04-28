import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/jury_menu.css';

function JuryMenu() {
  const navigate = useNavigate();
  const [atananIlanlar, setAtananIlanlar] = useState([]);
  const [selectedIlan, setSelectedIlan] = useState(null);
  const [basvurular, setBasvurular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  // Kullanıcı profil verilerini çekme
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Oturum bulunamadı');
        }

        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProfile(response.data);
      } catch (err) {
        console.error('Profil verisi çekilemedi:', err);
        setError(err.response?.data?.error || 'Profil yüklenirken bir hata oluştu');
      }
    };

    fetchProfile();
  }, []);

  // Atanan ilanları çekme
  useEffect(() => {
    const fetchAtananIlanlar = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Oturum bulunamadı');
        }

        const response = await axios.get('http://localhost:5000/api/juri-secim/atanan-ilanlar', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setAtananIlanlar(response.data);
      } catch (err) {
        console.error('İlanlar getirilemedi:', err);
        setError(err.response?.data?.error || 'İlanlar yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchAtananIlanlar();
  }, []);

  const handleIlanClick = async (ilan) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Oturum bulunamadı');
      }

      setSelectedIlan(ilan);
      
      const response = await axios.get(
        `http://localhost:5000/api/juri-secim/ilan/${ilan.id}/basvurular`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBasvurular(response.data);
    } catch (err) {
      console.error('Başvurular getirilemedi:', err);
      setError(err.response?.data?.error || 'Başvurular yüklenirken bir hata oluştu');
    }
  };

  // Güncellenmiş fonksiyon
  const handleBasvuruClick = (basvuruId) => {
    if (profile) {
      const juryName = `${profile.ad} ${profile.soyad}`;
      navigate(`/degerlendirme/Candidate_evaluation/${juryName}`, {
        state: { basvuruId }
      });
    } else {
      setError('Profil bilgileri yüklenemedi, lütfen tekrar deneyin.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  return (
    <div className="jury-menu-container">
      <h1 className="jury-menu-title">Jüri Değerlendirme Formları</h1>
      
      {loading ? (
        <p className="loading">Yükleniyor...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="jury-content">
          <div className="assigned-adverts">
            <h2>Size Atanan İlanlar</h2>
            {atananIlanlar.length === 0 ? (
              <p>Henüz size atanmış ilan bulunmamaktadır.</p>
            ) : (
              <ul className="advert-list">
                {atananIlanlar.map((ilan) => (
                  <li
                    key={ilan.id}
                    className={`advert-item ${selectedIlan?.id === ilan.id ? 'selected' : ''}`}
                    onClick={() => handleIlanClick(ilan)}
                  >
                    <h3>{ilan.baslik}</h3>
                    <p>{ilan.aciklama}</p>
                    <div className="advert-dates">
                      <span>Başlangıç: {formatDate(ilan.baslangic_tarihi)}</span>
                      <span>Bitiş: {formatDate(ilan.bitis_tarihi)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selectedIlan && (
            <div className="applications">
              <h2>{selectedIlan.baslik} - Başvurular</h2>
              {basvurular.length === 0 ? (
                <p>Bu ilana henüz başvuru yapılmamış.</p>
              ) : (
                <ul className="application-list">
                  {basvurular.map((basvuru) => (
                    <li
                      key={basvuru.id}
                      className="application-item"
                      onClick={() => handleBasvuruClick(basvuru.id)} // basvuru.id geçiriliyor
                    >
                      <div className="applicant-info">
                        <h4>{`${basvuru.user.ad} ${basvuru.user.soyad}`}</h4>
                        <p>{basvuru.user.email}</p>
                      </div>
                      <div className="application-details">
                        <span className={`status status-${basvuru.durum.toLowerCase()}`}>
                          {basvuru.durum}
                        </span>
                        <span className="date">
                          Başvuru: {formatDate(basvuru.basvuru_tarihi)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default JuryMenu;