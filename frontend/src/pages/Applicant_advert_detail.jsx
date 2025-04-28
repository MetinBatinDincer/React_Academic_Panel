import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate eklendi
import axios from 'axios';
import './css/Applicant_advert_detail.css';

function Applicant_advert_detail() {
  const { id } = useParams();
  const navigate = useNavigate(); // yönlendirme için hook
  const [announcement, setAnnouncement] = useState(null);
  const [requiredDocs, setRequiredDocs] = useState([]);
  const [error, setError] = useState(null);
  const [applyMessage, setApplyMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/api/ilanlar')
      .then((response) => {
        const ilanlar = response.data.ilanlar;
        const foundAdvert = ilanlar.find(item => item.id.toString() === id);
        setAnnouncement(foundAdvert);
      })
      .catch((error) => console.error("İlan detayları alınamadı:", error));

    if (id) {
      axios.get(`http://localhost:5000/api/admin/ilan-belge-turleri/${id}/belge-turleri`, {
        headers: { Authorization:` Bearer ${token}` },
      })
        .then((response) => {
          console.log('Gerekli Belgeler:', response.data);
          setRequiredDocs(response.data);
          setError(null);
        })
        .catch((error) => {
          const errorMsg = error.response ? error.response.data.error : error.message;
          console.error('Gerekli belgeler alınamadı:', errorMsg);
          setError(errorMsg);
          setRequiredDocs([]);
        });
    }
  }, [id]);

  const handleApply = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setApplyMessage("Lütfen önce giriş yapınız.");
        return;
      }
      //başvurnun oluştuğu alan
      
      const res = await axios.post(
        'http://localhost:5000/api/basvurular',
        { ilan_id: Number(id) },
        { headers: { Authorization:` Bearer ${token}` } }
      );

      //setApplyMessage("Başvurunuz başarıyla alındı!");
      //console.log("Başvuru oluşturma yanıtı:", res.data);

      // 1 saniye sonra yönlendir (istersen direkt navigate() de yazabilirsin)
       const basvuru_id = res.data.id;
       navigate('/Candidate_application', {
        state: {
          ilanId: Number(id),
          basvuruId: Number(basvuru_id)
        }
       });
       
      

    } catch (err) {
      console.error("Başvuru hatası:", err);
      const msg = err.response?.data?.error || "Başvuru oluşturulamadı";
      setApplyMessage(msg);
    }
  };

  return (
    <div className="advert-detail-container">
      {announcement ? (
        <div className="advert-card">
          <header className="advert-header">
            <h1 className="advert-title">{announcement.baslik}</h1>
            <p className="advert-date">
              {announcement.baslangic_tarihi} - {announcement.bitis_tarihi}
            </p>
          </header>
          <section className="advert-content">
            {announcement.aciklama || "İlan içeriği bulunmamaktadır."}
          </section>

          <section className="documents-section">
            <h2>Gerekli Belgeler</h2>
            <div className="documents-box">
              {error ? (
                <p className="error-message">{error}</p>
              ) : requiredDocs.length > 0 ? (
                <ul className="document-list">
                  {requiredDocs.map((doc) => (
                    <li key={doc.id} className="document-item">
                      <span className="doc-icon">📄</span>
                      <span className="doc-name">{doc.tur}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-docs">Gerekli belge bulunmamaktadır.</p>
              )}
            </div>
          </section>

          <div className="advert-actions">
            <button className="apply-button" onClick={handleApply}>
              Başvur
            </button>
            {applyMessage && <p className="apply-message">{applyMessage}</p>}
          </div>
        </div>
      ) : (
        <p className="loading">Yükleniyor...</p>
      )}
    </div>
  );
}

export default Applicant_advert_detail;
