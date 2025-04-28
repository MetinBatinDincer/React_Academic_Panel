import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/footer';
import './css/Jury_menu.css';
import axios from 'axios';

function Admin_home() {
  const [profile, setProfile] = useState(null);
  const [ilanlar, setIlanlar] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const ilanPerPage = 4;

  // Kullanıcı profil verilerini API'den çekme
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setProfile(response.data);
        })
        .catch((error) => {
          console.error('Profil verisi çekilemedi:', error);
        });
    }
  }, []);

  // İlan verilerini API'den çekme
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/ilanlar')
      .then((res) => {
        // API { ilanlar: [...] } formatında döndüğü için:
        setIlanlar(res.data.ilanlar);
      })
      .catch((err) => console.error('İlanlar çekilemedi:', err));
  }, []);

  // Pagination ayarları
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

  // İlan detay sayfasına yönlendirme
  const handleIlanClick = (id) => {
    navigate(`/AdminAdvertContent/${id}`);
  };

  // Yeni ilan ekleme sayfasına yönlendirme
  const handleYeniIlanEkle = () => {
    navigate('/AdminNewAdvert');
  };

  return (
    <div>
      <div className="jury-container">
        <div className="jury-container1">
          <div className="title-line">
            <h4>Kocaeli Üniversitesi Bilgi Merkezi</h4>
            <span className="line"></span>
          </div> <br /><br />
          <div className="jury-container1-in">
            <div className="jury-container-content">
              <span className="spanName">
                <p>Sayın {profile?.ad} {profile?.soyad}</p>
              </span>
              <p>Kocaeli Üniversitesi İlan</p>
              <p>Yönetim Paneline</p>
              <p>Hoşgeldiniz</p>
              <br />
              <button type="button" onClick={handleYeniIlanEkle}>
                Yeni İlan Ekle
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="jury-container3">
        <div className="jury-container3-left">
          <div className="title-line">
            <h4>Kocaeli Üniversitesi</h4>
            <span className="line"></span>
          </div>
          <h2>Güncel Aktif İlanlar</h2>
          <div className="jury-items">
            {currentItems.map((ilan) => (
              <div key={ilan.id} className="jury-item">
                <p className="jury-date">
                  {ilan.baslangic_tarihi} - {ilan.bitis_tarihi}
                </p>
                <p className="jury-role">{ilan.baslik}</p>
                <button
                  className="evaluate-button"
                  onClick={() => handleIlanClick(ilan.id)}
                >
                  İlan İçeriği
                </button>
              </div>
            ))}
          </div>
          <div className="pagination">
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
        <div className="jury-container3-right">
          <div className="jury-container3-right-container-image"></div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Admin_home;
