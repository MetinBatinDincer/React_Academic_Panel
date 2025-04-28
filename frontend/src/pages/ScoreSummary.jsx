import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/ScoreSummary.css';

const ScoreSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scores = location.state?.scores || {};
  const ilanId = location.state?.ilanId;
  const basvuruId = location.state?.basvuru;

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [criteria, setCriteria] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ type: '', message: '' });

  // Modal bileşeni
  const NotificationModal = ({ onClose, type, message }) => (
    <div className="modal-overlay">
      <div className={`modal-content ${type}`}>
        <h3>{type === 'success' ? '✅ Başvuru Başarılı' : '⚠️ Yetersiz Kriterler'}</h3>
        <p>{message}</p>
        <button onClick={onClose}>Tamam</button>
      </div>
    </div>
  );

  // Kriterleri çek
  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !ilanId) {
          console.log('Token veya ilanId eksik:', { token: !!token, ilanId });
          return;
        }

        console.log('Kriterler için ilanId:', ilanId);

        const response = await axios.get(
          `http://localhost:5000/api/ilanlar/${ilanId}/kriterler`,
          { 
            headers: { Authorization: `Bearer ${token}` },
            validateStatus: function (status) {
              return status < 500; // Sadece 500 ve üzeri hataları reject et
            }
          }
        );

        console.log('Gelen kriterler response:', response);

        if (response.status === 200 && response.data) {
          // Eğer response.data bir array ise ve içinde eleman varsa ilk elemanı al
          const criteriaData = Array.isArray(response.data) ? response.data[0] : response.data;
          if (criteriaData) {
            console.log('İşlenmiş kriter verisi:', criteriaData);
            setCriteria(criteriaData);
          } else {
            console.log('Kriter verisi boş geldi');
            setMessage('⚠️ Bu ilan için henüz kriterler belirlenmemiş.');
          }
        } else {
          console.log('Kriter getirme başarısız:', response.data);
          setMessage('⚠️ Kriterler getirilemedi: ' + (response.data?.error || 'Bilinmeyen hata'));
        }
      } catch (err) {
        console.error('Kriterler getirme hatası:', err.response || err);
        setMessage(
          err.response?.data?.error || 
          err.response?.data?.message || 
          err.message || 
          '❌ Kriterler yüklenirken bir hata oluştu'
        );
      }
    };

    fetchCriteria();
  }, [ilanId]);

  // Puanları kriterlere göre kontrol et
  const validateScores = () => {
    if (!criteria) {
      console.log('Kriterler henüz yüklenmedi'); // Debug log
      return false;
    }

    console.log('Kontrol edilen kriterler:', criteria); // Debug log
    console.log('Mevcut puanlar:', scores); // Debug log

    const errors = [];
    
    // Makaleler kontrolü
    const makalelerPuani = scores['A. Makaleler']?.total || 0;
    if (makalelerPuani < criteria.makaleler_puani) {
      errors.push(`Makaleler puanı minimum ${criteria.makaleler_puani} olmalıdır. Mevcut: ${makalelerPuani}`);
    }

    // BTF kontrolü
    const btfPuani = scores['B. Bilimsel Toplantı Faaliyetleri']?.total || 0;
    if (btfPuani < criteria.btf_puani) {
      errors.push(`Bilimsel Toplantı Faaliyetleri puanı minimum ${criteria.btf_puani} olmalıdır. Mevcut: ${btfPuani}`);
    }

    // Kitaplar kontrolü
    const kitaplarPuani = scores['C. Kitaplar']?.total || 0;
    if (kitaplarPuani < criteria.kitaplar_puani) {
      errors.push(`Kitaplar puanı minimum ${criteria.kitaplar_puani} olmalıdır. Mevcut: ${kitaplarPuani}`);
    }

    // Atıflar kontrolü
    const atiflarPuani = scores['D. Atıflar']?.total || 0;
    if (atiflarPuani < criteria.atiflar_puan) {
      errors.push(`Atıflar puanı minimum ${criteria.atiflar_puan} olmalıdır. Mevcut: ${atiflarPuani}`);
    }

    console.log('Validasyon hataları:', errors); // Debug log
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleApply = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Lütfen önce giriş yapınız.');
      return;
    }

    // Kriterleri kontrol et
    if (!validateScores()) {
      try {
        // Başvuruyu sil
        await axios.delete(
          `http://localhost:5000/api/basvurular/${basvuruId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Başarısız modal'ı göster
        setModalContent({
          type: 'error',
          message: 'Başvuru için kriterleriniz yetersiz. Lütfen size uygun olan kriterlere başvuruda bulununuz.'
        });
        setShowModal(true);
        return;
      } catch (err) {
        console.error('Başvuru silme hatası:', err);
        setMessage('❌ Belirlenen minimum kriterleri sağlamıyorsunuz ve başvuru silinirken hata oluştu.');
        return;
      }
    }
  
    setLoading(true);
    setMessage('');
    try {
      // scores içinden puanları al
      const makaleler_puani = scores['A. Makaleler']?.total || 0;
      const btf_puani = scores['B. Bilimsel Toplantı Faaliyetleri']?.total || 0;
      const kitaplar_puani = scores['C. Kitaplar']?.total || 0;
      const atiflar_puan = scores['D. Atıflar']?.total || 0;
      const toplam_puan = makaleler_puani + btf_puani + kitaplar_puani + atiflar_puan;
    
      await axios.post(
        `http://localhost:5000/api/basvurular/${basvuruId}/puanlar`,
        {
          makaleler_puani,
          btf_puani,
          kitaplar_puani,
          atiflar_puan,
          toplam_puan
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      // Başarılı modal'ı göster
      setModalContent({
        type: 'success',
        message: 'Başvurunuz alınmıştır. Başvuru sürecini geçmiş başvurulardan takip edebilirsiniz.'
      });
      setShowModal(true);
    } catch (err) {
      console.error('Puan kaydetme hatası:', err);
      const errMsg = err.response?.data?.error || err.message || 'Puanlar kaydedilemedi';
      setMessage(`❌ ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="score-summary-container">
      <h2>Puan Özeti {basvuruId}</h2>

      {showModal && (
        <NotificationModal 
          type={modalContent.type}
          message={modalContent.message}
          onClose={() => {
            setShowModal(false);
            navigate('/Applicant_home');
          }} 
        />
      )}

      {Object.keys(scores).length === 0 ? (
        <p>Henüz bir puan hesaplanmadı.</p>
      ) : (
        <>
          {criteria && (
            <div className="criteria-section">
              <h3>Minimum Puan Kriterleri</h3>
              <ul>
                <li>Makaleler: {criteria.makaleler_puani} puan</li>
                <li>Bilimsel Toplantı Faaliyetleri: {criteria.btf_puani} puan</li>
                <li>Kitaplar: {criteria.kitaplar_puani} puan</li>
                <li>Atıflar: {criteria.atiflar_puan} puan</li>
              </ul>
            </div>
          )}

          {Object.entries(scores).map(([section, data]) => (
            <div key={section} className="score-section">
              <h3>{section}</h3>
              <p>
                <strong>Toplam Puan:</strong> {data.total} puan
                {criteria && (
                  <span>
                    {' '}
                    (Minimum:{' '}
                    {section === 'A. Makaleler'
                      ? criteria.makaleler_puani
                      : section === 'B. Bilimsel Toplantı Faaliyetleri'
                      ? criteria.btf_puani
                      : section === 'C. Kitaplar'
                      ? criteria.kitaplar_puani
                      : criteria.atiflar_puan}{' '}
                    puan)
                  </span>
                )}
              </p>

              {data.details?.length > 0 && (
                <ul className="score-details">
                  {data.details.map((entry, i) => (
                    <li key={i}>
                      <strong>{entry.type}</strong>: {entry.score} puan
                    </li>
                  ))}
                </ul>
              )}

              {data.incomplete?.length > 0 && (
                <ul className="warning-list">
                  {data.incomplete.map((reason, i) => (
                    <li key={i} className="incomplete-item">
                      ⚠️ Eksik veri nedeniyle atlandı: {reason}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {validationErrors.length > 0 && (
            <div className="validation-errors">
              <h3>⚠️ Kriter Uyarıları</h3>
              <ul>
                {validationErrors.map((error, index) => (
                  <li key={index} className="error-item">{error}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {message && <div className="error-message">{message}</div>}

      <button
        className="apply-button"
        onClick={handleApply}
        disabled={loading || validationErrors.length > 0}
      >
        {loading ? 'Kaydediliyor...' : 'Başvur'}
      </button>

      <button className="go-back-button" onClick={() => navigate(-1)}>
        Geri Dön
      </button>
    </div>
  );
};

export default ScoreSummary;