import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/manager_advert_content.css';

function ManagerAdvertContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [advert, setAdvert] = useState(null);
  const [requiredDocs, setRequiredDocs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('profesor');
  const [criteria, setCriteria] = useState({
    profesor: [
      { name: 'Makaleler', minScore: 0 },
      { name: 'Bilimsel Toplantı Faaliyetleri', minScore: 0 },
      { name: 'Kitaplar', minScore: 0 },
      { name: 'Atıflar', minScore: 0 },
    ],
    docent: [
      { name: 'Makaleler', minScore: 0 },
      { name: 'Bilimsel Toplantı Faaliyetleri', minScore: 0 },
      { name: 'Kitaplar', minScore: 0 },
      { name: 'Atıflar', minScore: 0 },
    ],
    yeniden_atama: [
      { name: 'Makaleler', minScore: 0 },
      { name: 'Bilimsel Toplantı Faaliyetleri', minScore: 0 },
      { name: 'Kitaplar', minScore: 0 },
      { name: 'Atıflar', minScore: 0 },
    ],
    ilk_atama: [
      { name: 'Makaleler', minScore: 0 },
      { name: 'Bilimsel Toplantı Faaliyetleri', minScore: 0 },
      { name: 'Kitaplar', minScore: 0 },
      { name: 'Atıflar', minScore: 0 },
    ],
  });
  const [juryList, setJuryList] = useState([]);
  const [selectedJuries, setSelectedJuries] = useState([]);
  const [juryPage, setJuryPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [juryLoading, setJuryLoading] = useState(false);
  const itemsPerPage = 8;
  const juriesPerPage = 3;

  useEffect(() => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // İlan bilgilerini çek
        const ilanResponse = await axios.get(`http://localhost:5000/api/ilanlar/${id}`);
        const ilan = ilanResponse.data;
        
        if (!ilan) {
          throw new Error('İlan bulunamadı.');
        }
        
        setAdvert(ilan);

        // Gerekli belgeleri çek
        const docsResponse = await axios.get(
          `http://localhost:5000/api/admin/ilan-belge-turleri/${id}/belge-turleri`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRequiredDocs(docsResponse.data);

        // İlana yapılan başvuruları çek
        const basvuruResponse = await axios.get(
          `http://localhost:5000/api/basvurular/ilan/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (Array.isArray(basvuruResponse.data)) {
          setApplicants(basvuruResponse.data);
        } else {
          console.warn('Başvuru verisi dizi formatında değil:', basvuruResponse.data);
          setApplicants([]);
        }

      } catch (err) {
        console.error('Veri alınamadı:', err);
        let errorMessage = 'Veriler yüklenirken bir hata oluştu.';
        
        if (err.response) {
          // Sunucudan hata yanıtı geldi
          console.error('Sunucu yanıtı:', err.response.data);
          errorMessage = err.response.data.error || errorMessage;
          
          if (err.response.status === 404) {
            errorMessage = 'İlan bulunamadı.';
          } else if (err.response.status === 403) {
            errorMessage = 'Bu sayfaya erişim yetkiniz yok.';
          } else if (err.response.status === 401) {
            errorMessage = 'Oturumunuz sona ermiş. Lütfen tekrar giriş yapın.';
          }
        } else if (err.request) {
          // Sunucuya ulaşılamadı
          errorMessage = 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Jüri listesini ve seçili jürileri yükle
  useEffect(() => {
    const fetchJuryData = async () => {
      setJuryLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token bulunamadı');
        }

        // Tüm jüri listesini al
        const juryResponse = await axios.get('http://localhost:5000/api/juri-secim/juri-listesi', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJuryList(juryResponse.data);

        // İlanın mevcut jürilerini al
        const selectedJuryResponse = await axios.get(
          `http://localhost:5000/api/juri-secim/ilan/${id}/juriler`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSelectedJuries(selectedJuryResponse.data.map(jury => jury.id));
      } catch (err) {
        console.error('Jüri verisi alınamadı:', err);
        setError(err.response?.data?.error || 'Jüri bilgileri yüklenirken bir hata oluştu.');
      } finally {
        setJuryLoading(false);
      }
    };

    fetchJuryData();
  }, [id]);

  // Kriter puanı güncelleme
  const handleScoreChange = (index, value) => {
    const newScore = Math.max(0, Math.min(100, parseInt(value) || 0));
    setCriteria((prev) => ({
      ...prev,
      [selectedCategory]: prev[selectedCategory].map((criterion, i) =>
        i === index ? { ...criterion, minScore: newScore } : criterion
      ),
    }));
  };

  // Kriter puanlarını kaydet
  const handleSaveCriteria = async () => {
    try {
      const token = localStorage.getItem('token');
      const categoryData = criteria[selectedCategory];
      
      // Her bir kategori için kriterleri kaydet
      const response = await axios.post(
        `http://localhost:5000/api/ilanlar/${id}/kriterler`,
        {
          kategori: selectedCategory,
          makaleler_puani: categoryData.find(c => c.name === 'Makaleler')?.minScore || 0,
          btf_puani: categoryData.find(c => c.name === 'Bilimsel Toplantı Faaliyetleri')?.minScore || 0,
          kitaplar_puani: categoryData.find(c => c.name === 'Kitaplar')?.minScore || 0,
          atiflar_puan: categoryData.find(c => c.name === 'Atıflar')?.minScore || 0
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        alert('Kriter puanları başarıyla kaydedildi.');
      }
    } catch (err) {
      console.error('Kriter kaydetme başarısız:', err);
      if (err.response) {
        console.error('Sunucu yanıtı:', err.response.data);
        setError(err.response.data.message || 'Kriter puanları kaydedilirken hata oluştu.');
      } else {
        setError('Sunucuya bağlanırken bir hata oluştu.');
      }
      alert(error || 'Kriter puanları kaydedilirken bir hata oluştu.');
    }
  };

  // Sayfalama (Başvuru yapanlar)
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentApplicants = applicants.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(applicants.length / itemsPerPage);

  // Sayfalama (Jüriler)
  const indexOfLastJury = juryPage * juriesPerPage;
  const indexOfFirstJury = indexOfLastJury - juriesPerPage;
  const currentJuries = juryList.slice(indexOfFirstJury, indexOfLastJury);
  const totalJuryPages = Math.ceil(juryList.length / juriesPerPage);

  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const handleNextJuryPage = () => juryPage < totalJuryPages && setJuryPage(juryPage + 1);
  const handlePrevJuryPage = () => juryPage > 1 && setJuryPage(juryPage - 1);

  // Başvuru yapan kişiye tıklama
  const handleApplicantClick = (applicantId, applicant) => {
    navigate(`/manager/evaluation/${applicantId}`, {
      state: { 
        applicantName: applicant.user ? `${applicant.user.ad} ${applicant.user.soyad}` : 'İsim bilgisi yok',
        applicantEmail: applicant.user ? applicant.user.email : '',
        applicantId: applicantId
      }
    });
  };

  // Jüri seçimi
  const handleJurySelection = (juryId) => {
    setSelectedJuries((prev) =>
      prev.includes(juryId) ? prev.filter((id) => id !== juryId) : [...prev, juryId]
    );
  };

  // Jüri seçimini kaydet
  const handleSaveJuries = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token bulunamadı');
      }

      await axios.post(
        `http://localhost:5000/api/juri-secim/ilan/${id}/juri-ata`,
        { juri_ids: selectedJuries },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Jüri seçimi başarıyla kaydedildi.');
    } catch (err) {
      console.error('Jüri kaydetme başarısız:', err);
      alert(err.response?.data?.error || 'Jüri seçimi kaydedilirken bir hata oluştu.');
    }
  };

  return (
    <div className="mac-wrapper">
      <div className="mac-header">
        <div className="mac-kou-title">Kocaeli Üniversitesi</div>
        <div className="mac-content">
          {/* Sol Kısım: Gerekli Belgeler */}
          <div className="mac-docs">
            <h3 className="mac-section-title">Gerekli Belgeler</h3>
            <ul className="mac-doc-list">
              {requiredDocs.length > 0 ? (
                requiredDocs.map((doc) => (
                  <li key={doc.id} className="mac-doc-item">
                    <span className="mac-doc-icon">📄</span>
                    <span className="mac-doc-name">{doc.tur}</span>
                  </li>
                ))
              ) : (
                <li className="mac-doc-item">Gerekli belge bulunmamaktadır.</li>
              )}
            </ul>
          </div>

          {/* Orta Kısım: İlan Bilgileri */}
          <div className="mac-advert">
            <h1 className="mac-main-title">İlan Detayı</h1>
            {loading ? (
              <p className="mac-loading">İlan bilgisi yükleniyor...</p>
            ) : error ? (
              <p className="mac-error">{error}</p>
            ) : advert ? (
              <div className="mac-advert-details">
                <h2 className="mac-advert-title">{advert.baslik}</h2>
                <p className="mac-advert-desc">{advert.aciklama}</p>
                <p className="mac-advert-date">
                  <strong>Başlangıç Tarihi:</strong> {advert.baslangic_tarihi}
                </p>
                <p className="mac-advert-date">
                  <strong>Bitiş Tarihi:</strong> {advert.bitis_tarihi}
                </p>
              </div>
            ) : (
              <p className="mac-error">İlan bulunamadı.</p>
            )}
          </div>
        </div>
      </div>

      {/* Alt Kısım: Kriterler ve Başvuru Yapanlar */}
      <div className="mac-footer">
        <div className="mac-criteria">
          <h2 className="mac-section-title">Kriterler</h2>
          <div className="mac-criteria-tabs">
            <button
              className={`mac-tab-btn ${selectedCategory === 'profesor' ? 'mac-active' : ''}`}
              onClick={() => setSelectedCategory('profesor')}
            >
              Profesör
            </button>
            <button
              className={`mac-tab-btn ${selectedCategory === 'docent' ? 'mac-active' : ''}`}
              onClick={() => setSelectedCategory('docent')}
            >
              Doçent
            </button>
            <button
              className={`mac-tab-btn ${selectedCategory === 'yeniden_atama' ? 'mac-active' : ''}`}
              onClick={() => setSelectedCategory('yeniden_atama')}
            >
              Dr. Öğr. Üyesi (Yeniden Atama)
            </button>
            <button
              className={`mac-tab-btn ${selectedCategory === 'ilk_atama' ? 'mac-active' : ''}`}
              onClick={() => setSelectedCategory('ilk_atama')}
            >
              Dr. Öğr. Üyesi (İlk Atama)
            </button>
          </div>
          <ul className="mac-criteria-list">
            {criteria[selectedCategory].map((criterion, index) => (
              <li key={index} className="mac-criterion-item">
                <span>{`${String.fromCharCode(65 + index)}. ${criterion.name}`}</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={criterion.minScore}
                  onChange={(e) => handleScoreChange(index, e.target.value)}
                  className="mac-criterion-score-input"
                  placeholder="0-100"
                />
              </li>
            ))}
          </ul>
          <button onClick={handleSaveCriteria} className="mac-save-criteria-btn">
            Kriter Puanlarını Kaydet
          </button>
        </div>

        <div className="mac-applicants">
          <h2 className="mac-section-title">Başvuru Yapanlar</h2>
          {loading ? (
            <p className="mac-loading">Başvurular yükleniyor...</p>
          ) : error ? (
            <p className="mac-error">{error}</p>
          ) : (
            <>
              <ul className="mac-applicant-list">
                {currentApplicants.length > 0 ? (
                  currentApplicants.map((applicant) => (
                    <li
                      key={applicant.id}
                      className="mac-applicant-item"
                      onClick={() => handleApplicantClick(applicant.id, applicant)}
                    >
                      <div className="mac-applicant-info">
                        <span className="mac-applicant-name">
                          {applicant.user ? `${applicant.user.ad} ${applicant.user.soyad}` : 'İsim bilgisi yok'}
                        </span>
                        <span className="mac-applicant-email">
                          {applicant.user ? applicant.user.email : 'E-posta bilgisi yok'}
                        </span>
                      </div>
                      <div className="mac-applicant-details">
                        <span className={`mac-applicant-status mac-status-${applicant.durum.toLowerCase()}`}>
                          {applicant.durum}
                        </span>
                        <span className="mac-applicant-date">
                          Başvuru: {applicant.basvuru_tarihi}
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="mac-applicant-item mac-no-applicant">
                    Henüz başvuru yapan bulunmamaktadır.
                  </li>
                )}
              </ul>
              {currentApplicants.length > 0 && (
                <div className="mac-pagination">
                  <button
                    className="mac-page-btn"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    Önceki
                  </button>
                  <span className="mac-page-info">
                    Sayfa {currentPage} / {totalPages}
                  </span>
                  <button
                    className="mac-page-btn"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Sonraki
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Jüri Seçimi */}
      <div className="mac-jury">
        <div className="mac-jury-content">
          <h2 className="mac-section-title">Jüri Seçimi</h2>
          {juryLoading ? (
            <p className="mac-loading">Jüri listesi yükleniyor...</p>
          ) : error ? (
            <p className="mac-error">{error}</p>
          ) : (
            <>
              <ul className="mac-jury-list">
                {currentJuries.length > 0 ? (
                  currentJuries.map((jury) => (
                    <li key={jury.id} className="mac-jury-item">
                      <label className="mac-jury-label">
                        <input
                          type="checkbox"
                          checked={selectedJuries.includes(jury.id)}
                          onChange={() => handleJurySelection(jury.id)}
                        />
                        <span className="mac-jury-name">{`${jury.ad} ${jury.soyad}`}</span>
                        <span className="mac-jury-email">({jury.email})</span>
                      </label>
                    </li>
                  ))
                ) : (
                  <li className="mac-jury-item">Jüri bulunmamaktadır.</li>
                )}
              </ul>
              <div className="mac-jury-pagination">
                <button
                  className="mac-page-btn"
                  onClick={handlePrevJuryPage}
                  disabled={juryPage === 1}
                >
                  Önceki
                </button>
                <span className="mac-page-info">
                  Sayfa {juryPage} / {totalJuryPages}
                </span>
                <button
                  className="mac-page-btn"
                  onClick={handleNextJuryPage}
                  disabled={juryPage === totalJuryPages}
                >
                  Sonraki
                </button>
              </div>
              <button onClick={handleSaveJuries} className="mac-save-btn">
                Jüri Seçimini Kaydet
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManagerAdvertContent;