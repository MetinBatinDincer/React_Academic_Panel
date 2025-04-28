import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './css/manager_applicant_evaluation.css';

function ManagerApplicantEvaluation() {
  const { applicantId } = useParams();
  const location = useLocation();
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        console.log(`Başvuru ID: ${applicantId} için veriler alınıyor...`);
        console.log('Location state:', location.state);
        
        // 1. Tüm başvuruları çekelim ve ID'ye göre filtreleme yapalım
        const allApplicationsResponse = await axios.get(
          'http://localhost:5000/api/basvurular/all',
          config
        );
        
        const application = allApplicationsResponse.data.find(app => app.id === parseInt(applicantId));
        console.log('Bulunan başvuru:', application);
        
        if (!application) {
          throw new Error(`Başvuru bulunamadı. ID: ${applicantId}`);
        }

        // 2. Doğrudan puanlar tablosunu çekelim
        let puanlarData = null;
        try {
          const puanlarResponse = await axios.get(
            `http://localhost:5000/api/basvurular/${applicantId}/puanlar`,
            config
          );
          puanlarData = puanlarResponse.data;
          console.log('Puanlar tablosu (RAW):', puanlarResponse.data);
          console.log('Puanlar tablosu (JSON):', JSON.stringify(puanlarData, null, 2));
          
          // Ek debug için - Başlıkta "D. Atıflar" bölümündeki sistem puanı için
          console.log('DEBUG - Puanlar:');
          console.log('makaleler_puani:', puanlarData?.makaleler_puani);
          console.log('btf_puani:', puanlarData?.btf_puani);
          console.log('kitaplar_puani:', puanlarData?.kitaplar_puani);
          console.log('atiflar_puan:', puanlarData?.atiflar_puan);
        } catch (puanlarErr) {
          console.warn('Puanlar alınamadı:', puanlarErr);
        }

        // 3. Değerlendirme tablosunu çekelim
        let degerlendirmeData = null;
        try {
          const degerlendirmeResponse = await axios.get(
            `http://localhost:5000/api/basvurular/${applicantId}/degerlendirme`, 
            config
          );
          degerlendirmeData = degerlendirmeResponse.data;
          console.log('Değerlendirme tablosu:', degerlendirmeData);
        } catch (degerlendirmeErr) {
          console.warn('Değerlendirme alınamadı:', degerlendirmeErr);
        }

        // 4. Başvurunun ilan ID'sini kullanarak ilana yapılan tüm başvuruları çekelim
        let applicationsForAdvert = [];
        try {
          const ilanId = application.ilan_id;
          if (ilanId) {
            const advertApplicationsResponse = await axios.get(
              `http://localhost:5000/api/basvurular/ilan/${ilanId}`,
              config
            );
            applicationsForAdvert = advertApplicationsResponse.data || [];
            console.log(`İlan ID ${ilanId} için yapılan başvurular:`, applicationsForAdvert);
          }
        } catch (advertAppsErr) {
          console.warn('İlana yapılan başvurular alınamadı:', advertAppsErr);
        }

        // 5. Kullanıcı bilgilerini çekelim (başvurudan kullanıcı ID'sini alarak)
        let userData = null;
        if (application.kullanici_id) {
          try {
            const userResponse = await axios.get(
              `http://localhost:5000/api/users/${application.kullanici_id}`,
              config
            );
            userData = userResponse.data;
            console.log('Kullanıcı verileri:', userData);
          } catch (userErr) {
            console.warn('Kullanıcı bilgileri alınamadı:', userErr);
          }
        }

        // 6. İlana atanan jüri bilgilerini çekelim
        let assignedJuries = [];
        try {
          // Önce ilan ID'sini alalım
          const ilanId = application.ilan_id;
          if (ilanId) {
            const juriesResponse = await axios.get(
              `http://localhost:5000/api/juri-secim/ilan/${ilanId}/juriler`,
              config
            );
            assignedJuries = juriesResponse.data || [];
            console.log('İlana atanan jüriler:', assignedJuries);
          }
        } catch (juriesErr) {
          console.warn('İlana atanan jüriler alınamadı:', juriesErr);
        }

        // Jüri verisini birleştirelim - önce değerlendirme yapmış olan jüriyi bulalım
        let juryData = { ad: 'Bilinmiyor', soyad: '', email: '' };
        
        // Değerlendirme yapan jüri varsa, bilgilerini alalım
        if (degerlendirmeData && degerlendirmeData.juri_id) {
          try {
            const juryResponse = await axios.get(
              `http://localhost:5000/api/users/${degerlendirmeData.juri_id}`,
              config
            );
            juryData = juryResponse.data;
            console.log('Değerlendirme yapan jüri:', juryData);
          } catch (juryErr) {
            console.warn('Jüri bilgileri alınamadı:', juryErr);
          }
        }
        // Atanmış jüriler varsa ve değerlendirme yapan jüri yoksa, ilk jüriyi gösterelim
        else if (assignedJuries.length > 0) {
          juryData = assignedJuries[0];
        }

        // Başvuran adayın bilgilerini doğru şekilde alalım
        let applicantName = '';
        let applicantEmail = '';

        // 1. Önce location state'ten gelen başvuran bilgisini kontrol edelim
        if (location.state && location.state.applicantName) {
          applicantName = location.state.applicantName;
          applicantEmail = location.state.applicantEmail || '';
        } 
        // 2. Sonra application.user objesi var mı kontrol edelim
        else if (application.user && application.user.ad && application.user.soyad) {
          applicantName = `${application.user.ad} ${application.user.soyad}`;
          applicantEmail = application.user.email || '';
        }
        // 3. Sonra userData objesi var mı kontrol edelim
        else if (userData && userData.ad && userData.soyad) {
          applicantName = `${userData.ad} ${userData.soyad}`;
          applicantEmail = userData.email || '';
        }
        // 4. Son olarak ilana yapılan başvurulardan eşleşen başvuruyu bulalım
        else if (applicationsForAdvert.length > 0) {
          const matchingApp = applicationsForAdvert.find(app => app.id === parseInt(applicantId));
          if (matchingApp && matchingApp.user) {
            applicantName = `${matchingApp.user.ad} ${matchingApp.user.soyad}`;
            applicantEmail = matchingApp.user.email || '';
          }
        }

        // Hala bulunamadıysa başvuru ID'sini gösterelim
        if (!applicantName) {
          applicantName = `Başvuru ${applicantId}`;
        }

        // Jüri raporunu tespit et (Candidate_evaluation.jsx'teki gibi)
        let juryReport = 'Henüz değerlendirme yapılmamış.';
        
        // Candidate_evaluation.jsx dosyasında yapıldığı gibi veri kaynağını kontrol et
        if (degerlendirmeData && degerlendirmeData.degerlendirme_metni && degerlendirmeData.degerlendirme_metni.trim() !== '') {
          juryReport = degerlendirmeData.degerlendirme_metni;
          console.log('Jüri raporu değerlendirme_metni alanından alındı:', juryReport);
        } 
        // Eğer juri_yorumu varsa, onu kullan (değerlendirme_metni genellikle juri_yorumu verisinden geliyor)
        else if (puanlarData && puanlarData.juri_yorumu && puanlarData.juri_yorumu.trim() !== '' && puanlarData.juri_yorumu !== 'değerlendirilmedi') {
          juryReport = puanlarData.juri_yorumu;
          console.log('Jüri raporu juri_yorumu alanından alındı:', juryReport);
        }
        // Jüri raporu alanını kontrol et
        else if (puanlarData && puanlarData.juri_raporu && 
                puanlarData.juri_raporu.trim() !== '' && 
                puanlarData.juri_raporu !== 'değerlendirilmedi') {
          juryReport = puanlarData.juri_raporu;
          console.log('Jüri raporu juri_raporu alanından alındı:', juryReport);
        }
        
        console.log('Son jüri raporu değeri:', juryReport);
        
        // Transform the data to match our component's structure
        const transformedData = {
          applicantId,
          applicantName,
          applicantEmail,
          juryName: juryData ? `${juryData.ad} ${juryData.soyad}` : 'Henüz jüri atanmamış',
          juryEmail: juryData.email || '',
          juryReport,
          scores: [
            {
              criterion: 'Makaleler',
              systemScore: puanlarData ? (Number(puanlarData.makaleler_puani) || 0) : 0,
              juryScore: puanlarData ? (Number(puanlarData.juri_makaleler_puani) || 0) : 0,
            },
            {
              criterion: 'Bilimsel Toplantı Faaliyetleri',
              systemScore: puanlarData ? (Number(puanlarData.btf_puani) || 0) : 0,
              juryScore: puanlarData ? (Number(puanlarData.juri_btf_puani) || 0) : 0,
            },
            {
              criterion: 'Kitaplar',
              systemScore: puanlarData ? (Number(puanlarData.kitaplar_puani) || 0) : 0,
              juryScore: puanlarData ? (Number(puanlarData.juri_kitaplar_puani) || 0) : 0,
            },
            {
              criterion: 'Atıflar',
              systemScore: puanlarData && typeof puanlarData.atiflar_puan !== 'undefined' 
                ? Number(puanlarData.atiflar_puan) 
                : 0,
              juryScore: puanlarData && typeof puanlarData.juri_atiflar_puan !== 'undefined' 
                ? Number(puanlarData.juri_atiflar_puan) 
                : 0,
            },
          ],
          overallSystemScore: puanlarData ? (Number(puanlarData.toplam_puan) || 0) : 0,
          overallJuryScore: puanlarData ? (Number(puanlarData.juri_toplam_puan) || 0) : 0,
          status: application.durum || 'Beklemede',
          assignedJuries: assignedJuries
        };

        setEvaluation(transformedData);
        setLoading(false);
      } catch (err) {
        console.error('Veri alınamadı:', err);
        const errorMessage = err.response?.data?.error || err.message || 'Değerlendirme yüklenirken hata oluştu.';
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchData();
  }, [applicantId, location.state]);

  const handleApprove = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
      }

      await axios.put(
        `http://localhost:5000/api/basvurular/${applicantId}/status`,
        { durum: 'Onaylandı' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Başvuru onaylandı.');
      // Güncelleme sonrası durumu yansıt
      setEvaluation(prev => prev ? {...prev, status: 'Onaylandı'} : prev);
    } catch (err) {
      console.error('Onaylama başarısız:', err);
      setError(err.response?.data?.error || err.message || 'Başvuru onaylanırken hata oluştu.');
    }
  };

  const handleReject = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
      }

      await axios.put(
        `http://localhost:5000/api/basvurular/${applicantId}/status`,
        { durum: 'Reddedildi' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Başvuru reddedildi.');
      // Güncelleme sonrası durumu yansıt
      setEvaluation(prev => prev ? {...prev, status: 'Reddedildi'} : prev);
    } catch (err) {
      console.error('Reddetme başarısız:', err);
      setError(err.response?.data?.error || err.message || 'Başvuru reddedilirken hata oluştu.');
    }
  };

  return (
    <div className="mae-wrapper">
      <div className="mae-kou-title">Kocaeli Üniversitesi</div>
      <h1 className="mae-main-title">Başvuru Değerlendirme Raporu</h1>
      {loading ? (
        <p className="mae-loading">Rapor yükleniyor...</p>
      ) : error ? (
        <p className="mae-error">{error}</p>
      ) : evaluation ? (
        <div className="mae-card">
          <div className="mae-applicant-info">
            <h2 className="mae-applicant-name">Başvuran: {evaluation.applicantName}</h2>
            <p className="mae-applicant-email">E-posta: {evaluation.applicantEmail}</p>
            <p className="mae-applicant-status">Durum: <span className={`status-${evaluation.status.toLowerCase()}`}>{evaluation.status}</span></p>
          </div>
          <h3 className="mae-jury-name">Jüri Üyesi: {evaluation.juryName}</h3>
          {evaluation.juryEmail && <p className="mae-jury-email">E-posta: {evaluation.juryEmail}</p>}
          
          {evaluation.assignedJuries && evaluation.assignedJuries.length > 1 && (
            <div className="mae-other-juries">
              <h4 className="mae-other-juries-title">Diğer Atanan Jüri Üyeleri:</h4>
              <ul className="mae-juries-list">
                {evaluation.assignedJuries.slice(1).map((jury, index) => (
                  <li key={index}>{jury.ad} {jury.soyad} ({jury.email})</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mae-jury-report">
            <h4 className="mae-report-title">Jüri Raporu</h4>
            <p className="mae-report-content">{evaluation.juryReport}</p>
          </div>
          <div className="mae-scores">
            <h4 className="mae-scores-title">Puanlar</h4>
            <table className="mae-scores-table">
              <thead>
                <tr>
                  <th>Kriter</th>
                  <th>Sistem Puanı</th>
                  <th>Jüri Puanı</th>
                </tr>
              </thead>
              <tbody>
                {evaluation.scores.map((score, index) => (
                  <tr key={index}>
                    <td>{score.criterion}</td>
                    <td>{score.systemScore}</td>
                    <td>{score.juryScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mae-overall-scores">
              <h4 className="mae-overall-title">Genel Puanlar</h4>
              <table className="mae-overall-table">
                <tbody>
                  <tr>
                    <td><strong>Genel Sistem Puanı</strong></td>
                    <td>{typeof evaluation.overallSystemScore === 'number' ? 
                         evaluation.overallSystemScore.toFixed(2) : 
                         evaluation.overallSystemScore}</td>
                  </tr>
                  <tr>
                    <td><strong>Genel Jüri Puanı</strong></td>
                    <td>{typeof evaluation.overallJuryScore === 'number' ? 
                         evaluation.overallJuryScore.toFixed(2) : 
                         evaluation.overallJuryScore}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="mae-actions">
            <button className="mae-approve-btn" onClick={handleApprove}>
              Başvuruyu Onayla
            </button>
            <button className="mae-reject-btn" onClick={handleReject}>
              Başvuruyu Reddet
            </button>
          </div>
        </div>
      ) : (
        <p className="mae-error">Değerlendirme raporu bulunamadı.</p>
      )}
    </div>
  );
}

export default ManagerApplicantEvaluation;