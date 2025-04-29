import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/footer';
import './css/manager_home.css';
import axios from 'axios';

function ManagerHome() {
  const [profile, setProfile] = useState(null);
  const [ilanlar, setIlanlar] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const ilanPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Profil verisini çek
        const token = localStorage.getItem('token');
        if (token) {
          const profileRes = await axios.get('http://localhost:5000/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProfile(profileRes.data);
        }

        // İlanları çek
        const ilanlarRes = await axios.get('http://localhost:5000/api/ilanlar');
        setIlanlar(ilanlarRes.data.ilanlar || []);
      } catch (err) {
        console.error('Veri çekme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(ilanlar.length / ilanPerPage);
  const currentItems = ilanlar.slice(
    (currentPage - 1) * ilanPerPage,
    currentPage * ilanPerPage
  );
  
  // İlanları ikiye bölmek için
  const halfwayIndex = Math.ceil(currentItems.length / 2);
  const firstHalfItems = currentItems.slice(0, halfwayIndex);
  const secondHalfItems = currentItems.slice(halfwayIndex);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleIlanClick = (id) => {
    navigate(`/ManagerAdvertContent/${id}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  if (loading) {
    return (
      <div className="mh-loading">
        <div className="mh-loading-spinner"></div>
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="mh-wrapper">
      <div className="mh-container">
        <div className="mh-header">
          <div className="mh-title-line">
            <h4>Kocaeli Üniversitesi Bilgi Merkezi</h4>
            <span className="mh-line"></span>
          </div>
          <div className="mh-header-inner">
            <div className="mh-welcome">
              <span className="mh-user-name">
                <p>Sayın {profile?.ad} {profile?.soyad}</p>
              </span>
              <p>Kocaeli Üniversitesi İlanlar</p>
              <p>Yönetim Paneline</p>
              <p>Hoşgeldiniz</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mh-main-container">
        {/* Info card moved to the top */}
        <div className="mh-info-card-container">
          <div className="mh-info-card">
            <h3>Yönetici Paneli</h3>
            <p>Kocaeli Üniversitesi ilan sistemi yönetim paneline hoş geldiniz. Bu panel üzerinden ilanları yönetebilir ve başvuruları değerlendirebilirsiniz.</p>
          </div>
        </div>

        <div className="mh-title-line mh-title-center">
          <h4>Kocaeli Üniversitesi</h4>
          <span className="mh-line"></span>
        </div>
        <h2 className="mh-main-title">İlanlar</h2>
        
        {ilanlar.length === 0 ? (
          <div className="mh-no-ilan">
            <p>Şu anda gösterilecek ilan bulunmamaktadır.</p>
          </div>
        ) : (
          <>
            <div className="mh-ilan-lists-container">
              {/* First column of ilanlar */}
              <div className="mh-ilan-list">
                {firstHalfItems.map((ilan) => (
                  <div key={ilan.id} className="mh-ilan-item">
                    <p className="mh-ilan-date">
                      {formatDate(ilan.baslangic_tarihi)} - {formatDate(ilan.bitis_tarihi)}
                    </p>
                    <p className="mh-ilan-title">{ilan.baslik}</p>
                    <button
                      className="mh-detail-button"
                      onClick={() => handleIlanClick(ilan.id)}
                    >
                      İlan Detay
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Second column of ilanlar */}
              <div className="mh-ilan-list">
                {secondHalfItems.map((ilan) => (
                  <div key={ilan.id} className="mh-ilan-item">
                    <p className="mh-ilan-date">
                      {formatDate(ilan.baslangic_tarihi)} - {formatDate(ilan.bitis_tarihi)}
                    </p>
                    <p className="mh-ilan-title">{ilan.baslik}</p>
                    <button
                      className="mh-detail-button"
                      onClick={() => handleIlanClick(ilan.id)}
                    >
                      İlan Detay
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mh-pagination">
              <button onClick={prevPage} disabled={currentPage === 1}>
                &laquo; Önceki
              </button>
              <span>
                Sayfa {currentPage} / {totalPages || 1}
              </span>
              <button onClick={nextPage} disabled={currentPage === totalPages || totalPages === 0}>
                Sonraki &raquo;
              </button>
            </div>
          </>
        )}
        
        <div className="mh-stats-summary">
          <div className="mh-stat-item">
            <div className="mh-stat-number">{ilanlar.length}</div>
            <div className="mh-stat-label">Toplam İlan</div>
          </div>
          <div className="mh-stat-item">
            <div className="mh-stat-number">{ilanlar.filter(ilan => new Date(ilan.bitis_tarihi) > new Date()).length}</div>
            <div className="mh-stat-label">Aktif İlan</div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ManagerHome;