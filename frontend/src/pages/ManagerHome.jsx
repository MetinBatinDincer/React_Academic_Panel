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

  if (loading) {
    return <div className="mh-loading">Yükleniyor...</div>;
  }

  return (
    <div className="mh-wrapper">
      <div className="mh-container">
        <div className="mh-header">
          <div className="mh-title-line">
            <h4>Kocaeli Üniversitesi Bilgi Merkezi</h4>
            <span className="mh-line"></span>
          </div>
          <br />
          <br />
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

      <div className="mh-main">
        <div className="mh-ilanlar">
          <div className="mh-title-line">
            <h4>Kocaeli Üniversitesi</h4>
            <span className="mh-line"></span>
          </div>
          <h2>İlanlar</h2>
          <div className="mh-ilan-list">
            {currentItems.map((ilan) => (
              <div key={ilan.id} className="mh-ilan-item">
                <p className="mh-ilan-date">
                  {ilan.baslangic_tarihi} - {ilan.bitis_tarihi}
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
          <div className="mh-pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>
              Önceki
            </button>
            <span>
              Sayfa {currentPage} / {totalPages}
            </span>
            <button onClick={nextPage} disabled={currentPage === totalPages}>
              Sonraki
            </button>
          </div>
        </div>
        <div className="mh-image-area">
          <div className="mh-image-placeholder"></div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ManagerHome;