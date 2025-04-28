import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Announcement_preview.css';
import Footer from '../Components/footer';

function Announcement_preview() {
  const { role } = useParams(); // Çalışan kodunda 'role' kullanılıyor, bunu koruyoruz
  const navigate = useNavigate();

  // Sabit jüri verileri ve sayfalama
  const itemsPerPage = 4;
  const juryData = [
    ["Ahmet Yılmaz", "Elif Demir", "Mert Koç", "Zeynep Kara"],
    ["Bora Şahin", "Deniz Aydın", "Cemre Öztürk", "Baran Aksoy"]
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = juryData.length;
  const currentItems = juryData[currentPage - 1];

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleEvaluate = (juryName) => {
    navigate(`/degerlendirme/Candidate_evaluation/${juryName}`);
  };

  // İlan detayları ve gerekli belgeler için state'ler
  const [announcement, setAnnouncement] = useState(null);
  const [requiredDocs, setRequiredDocs] = useState([]);
  const [error, setError] = useState(null); // Hata yönetimi için eklendi

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    console.log('Role (ilan ID):', role);

    if (!token) {
      console.warn('Token bulunamadı, login sayfasına yönlendiriliyor...');
      navigate('/login');
      return;
    }

    // İlan ID kontrolü
    if (!role) {
      console.error('İlan ID belirtilmemiş.');
      setError('İlan ID belirtilmemiş.');
      return;
    }

    // İlan detaylarını çek (çalışan kısım korunuyor)
    axios.get('http://localhost:5000/api/ilanlar')
      .then((response) => {
        const ilanlar = response.data.ilanlar;
        const found = ilanlar.find(item => item.id.toString() === role);
        if (found) {
          setAnnouncement(found);
          console.log('Bulunan ilan:', found);
        } else {
          console.error('İlan bulunamadı:', role);
          setError('İlan bulunamadı.');
        }
      })
      .catch((error) => {
        console.error('İlan verisi çekilemedi:', error.response?.data || error.message);
        setError('İlan verisi çekilemedi.');
      });

    // Gerekli belge türlerini çek (doğru endpoint ile güncellendi)
    axios.get(`http://localhost:5000/api/admin/ilan-belge-turleri/${role}/belge-turleri`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        console.log('Gelen belge verileri:', response.data);
        setRequiredDocs(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error('Gerekli belge türleri alınamadı:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        setError('Gerekli belgeler alınamadı.');
      });
  }, [role, navigate]);

  return (
    <div className='all'>
      <div className="announcement-container">
        <div className="announcement-content">
          {/* Üst kısım: Başlık + çizgi */}
          <div className="announcement-title-line">
            <h5>Kocaeli Üniversitesi Bilgi Merkezi</h5>
            <span className="line"></span>
          </div>

          {/* Hata mesajı gösterimi */}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div className="Aradiv">
            {/* Sol taraf: Jüri kartları */}
            <div className="jury-items">
              <h2>Jüri Değerlendirme Formları</h2>
              {currentItems.map((jury, index) => (
                <div key={index} className="jury-item">
                  <p className="jury-date">27.11.2025</p>
                  <p className="jury-role">Sayın {jury} için başvuru kartı</p>
                  <button
                    className="evaluate-button"
                    onClick={() => handleEvaluate(jury)}
                  >
                    Değerlendir
                  </button>
                </div>
              ))}

              {/* Sayfalama Butonları */}
              <div className="announcement-buttons" style={{ marginTop: "10px" }}>
                <button className="prev-button" onClick={prevPage} disabled={currentPage === 1}>
                  Önceki
                </button>
                <button className="primary-button" onClick={nextPage} disabled={currentPage === totalPages}>
                  Sonraki
                </button>
              </div>
            </div>

            {/* Sağ taraf: Duyuru kartı (ilan detayları ve gerekli belgeler) */}
            <div className="announcement-card2">
              <div className="announcement-image-box">
                {requiredDocs.length > 0 ? (
                  <ul>
                    {requiredDocs.map((doc) => (
                      <li key={doc.id}>{doc.tur}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Gerekli belge bulunmamaktadır.</p>
                )}
              </div>
              <div className="announcement-text">
                {announcement ? (
                  <>
                    <h2>Duyuru İçeriği ({announcement.baslik})</h2>
                    <p>{announcement.aciklama}</p>
                  </>
                ) : (
                  <>
                    <h2>Duyuru İçeriği</h2>
                    <p>İlan bilgileri yükleniyor...</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Announcement_preview;