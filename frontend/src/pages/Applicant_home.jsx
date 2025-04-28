import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Components/footer';
import './css/Applicant_home.css';
import axios from 'axios';

function Applicant_home() {
  const [profile, setProfile] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [applications, setApplications] = useState([]);
  const [currentPage2, setCurrentPage2] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => setProfile(response.data))
      .catch((error) => console.error("Profil verisi çekilemedi:", error));
    }
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/ilanlar')
      .then((response) => {
        setAnnouncements(response.data.ilanlar);
      })
      .catch((error) => {
        console.error("İlan verisi çekilemedi:", error);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/api/basvurular', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setApplications(res.data))
      .catch((err) => console.error("Başvuru verisi çekilemedi:", err));
    }
  }, []);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(announcements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAnnouncements = announcements.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const itemsPerPage2 = 4;
  const totalPages2 = Math.ceil(applications.length / itemsPerPage2);
  const startIndex2 = (currentPage2 - 1) * itemsPerPage2;
  const currentApps = applications.slice(startIndex2, startIndex2 + itemsPerPage2);

  const nextPage2 = () => {
    if (currentPage2 < totalPages2) setCurrentPage2(currentPage2 + 1);
  };
  const prevPage2 = () => {
    if (currentPage2 > 1) setCurrentPage2(currentPage2 - 1);
  };

  return (
    <div>
      <div className="jury-container">
        <div className="jury-container1">
          <div className="title-line">
            <h4>Kocaeli Üniversitesi Bilgi Merkezi</h4>
            <span className="line"></span>
          </div>
          <br /><br />
          <div className="jury-container1-in">
            <div className="jury-container-content">
              <span className="spanName">
                <p>Sayın {profile?.ad} {profile?.soyad}</p>
              </span>
              <p>Kocaeli Üniversitesi</p>
              <p>Akademik Personel</p>
              <p>Başvuru Sistemine</p>
              <p>Hoşgeldiniz</p>
              <br />
              <Link to="/myAccount">
                <button type="button">Hesabım</button>
              </Link>
            </div>
          </div>
        </div>

        {/* Duyuru Kartı (Sarı Container) */}
        <div className="jury-container2">
          <div className="announcement-card">
            <div className="announcement-image">
              <div className="announcement-image-left"></div>
              <div className="announcement-image-right"></div>
            </div>
            <p className="date">27.11.2025</p>
            <h3 className="announcement-title">Duyuru Başlık Alanı</h3>
          </div>
        </div>
      </div>

      {/* En Son Yüklenen İlanlar */}
      <div className="jury-container3">
        <div className="jury-container3-left">
          <div className="title-line">
            <h4>Güncel Bilgilere Hızlı Erişin</h4>
            <span className="line"></span>
          </div>
          <h2>En Son Yüklenen İlanlar</h2>
          <div className="jury-items">
            {currentAnnouncements.map((ilan) => (
              <div key={ilan.id} className="jury-item">
                <p className="jury-date">{ilan.baslangic_tarihi}</p>
                <p className="jury-role">{ilan.baslik}</p>
                <Link to={`/ilan/${ilan.id}`}>
                  <button className="evaluate-button">Detay</button>
                </Link>
              </div>
            ))}
          </div>
          <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>Önceki</button>
            <span>Sayfa {currentPage} / {totalPages}</span>
            <button onClick={nextPage} disabled={currentPage === totalPages}>Sonraki</button>
          </div>
        </div>
        <div className="jury-container3-right">
          <div className="jury-container3-right-container-image"></div>
        </div>
      </div>

      {/* Başvuru Geçmişi */}
      <div className="jury-container3">
        <div className="jury-container3-left">
          <div className="title-line">
            <h4>Güncel Bilgilere Hızlı Erişin</h4>
            <span className="line"></span>
          </div>
          <h2>Başvuru Geçmişi</h2>
          <div className="jury-items">
            {currentApps.map((app) => {
              const ilanBul = announcements.find(ilan => ilan.id === app.ilan_id);
              return (
                <div key={app.id} className="jury-item">
                  <p className="jury-date">{app.basvuru_tarihi?.split('T')[0]}</p>
                  <p className="jury-role">
                    {ilanBul ? ilanBul.baslik : `İlan #${app.ilan_id}`}
                  </p>
                  <button className="evaluate-button">{app.durum}</button>
                </div>
              );
            })}
          </div>
          <div className="pagination">
            <button onClick={prevPage2} disabled={currentPage2 === 1}>Önceki</button>
            <span>Sayfa {currentPage2} / {totalPages2}</span>
            <button onClick={nextPage2} disabled={currentPage2 === totalPages2}>Sonraki</button>
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

export default Applicant_home;
