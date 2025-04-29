import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/ScoreSummary.css';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

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
  const [userData, setUserData] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

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

  // Kullanıcı bilgilerini çek
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('Token eksik');
          return;
        }

        const response = await axios.get(
          'http://localhost:5000/api/users/profile',
          { 
            headers: { Authorization: `Bearer ${token}` },
            validateStatus: function (status) {
              return status < 500;
            }
          }
        );

        if (response.status === 200 && response.data) {
          console.log('Kullanıcı bilgileri:', response.data);
          setUserData(response.data);
        } else {
          console.log('Kullanıcı bilgileri getirilemedi:', response.data);
        }
      } catch (err) {
        console.error('Kullanıcı bilgileri getirme hatası:', err.response || err);
      }
    };

    fetchUserData();
  }, []);

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

  // PDF oluştur ve indir
  const generatePDF = async () => {
    setPdfLoading(true);
    try {
      console.log('PDF oluşturma başladı');
      
      // Türkçe karakter sorununu çözmek için metinleri ASCII karakterlere dönüştür
      const turkishToAscii = (text) => {
        if (!text) return '';
        
        return String(text)
          .replace(/ş/g, 's').replace(/Ş/g, 'S')
          .replace(/ı/g, 'i').replace(/İ/g, 'I')
          .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
          .replace(/ü/g, 'u').replace(/Ü/g, 'U')
          .replace(/ö/g, 'o').replace(/Ö/g, 'O')
          .replace(/ç/g, 'c').replace(/Ç/g, 'C');
      };
      
      // PDF dokümanını oluştur
      const pdfDoc = await PDFDocument.create();
      
      // Standart font kullan
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      // Özel check (onay) karakteri için Symbol fontunu ekle
      const symbolFont = await pdfDoc.embedFont(StandardFonts.Symbol);
      
      // Sayfa ekle (A4 boyutu)
      const page = pdfDoc.addPage([595.28, 841.89]);
      const { width, height } = page.getSize();
      let y = height - 50; // Başlangıç Y pozisyonu
      const margin = 50;
      
      // Bugünün tarihini formatla
      const today = new Date();
      const formattedToday = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`;
      
      // Kullanıcı rol bilgisini al
      const userRole = userData?.rol || 'aday'; // Varsayılan olarak 'aday'
      
      // Akademik kadro bilgisi
      let akademikKadro = '';
      // Rol bilgisine göre uygun akademik kadroyu belirle
      if (userRole === 'profesor') {
        akademikKadro = 'Profesör';
      } else if (userRole === 'docent') {
        akademikKadro = 'Doçent';
      } else if (userRole === 'dr_ogretim_uyesi') {
        akademikKadro = 'Dr. Öğretim Üyesi';
      } else {
        akademikKadro = 'Araştırma Görevlisi';
      }
      
      // Başlık ekle
      page.drawText('BASVURU PUAN OZETI', {
        x: margin,
        y,
        size: 18,
        font: boldFont
      });
      y -= 40;
      
      // Tek büyük tablo oluştur
      // Tablo başlıkları ve satırları
      const tableRows = [];
      
      // Genel Puanlama Bilgileri başlık satırı
      tableRows.push(['GENEL PUANLAMA BILGILERI', '']); // Başlık satırı
      
      // Aday bilgileri
      tableRows.push(['Adı Soyadı (Ünvanı):', userData && userData.ad && userData.soyad ? `${userData.ad} ${userData.soyad}` : '']);
      tableRows.push(['Tarih:', formattedToday]);
      tableRows.push(['Bulunduğu Kurum:', 'Kocaeli Üniversitesi']);
      tableRows.push(['Başvurduğu Akademik Kadro:', akademikKadro]);
      tableRows.push(['İmza:', '']);
      
      // Puanlanan Faaliyet Dönemi başlık satırı
      tableRows.push(['PUANLANAN FAALIYET DONEMI', '']); // Başlık satırı
      
      // Onay işareti olarak kullanılacak karakter
      const checkMark = 'X'; // Standard ASCII karakter kullan, Unicode (✓) yerine
      
      // Faaliyet dönemi seçenekleri - rolüne göre işaretleme yap
      tableRows.push(['Profesor (Docent unvanini aldiktan sonraki faaliyetleri esas alinacaktir)', userRole === 'profesor' ? `[${checkMark}]` : '[ ]']);
      tableRows.push(['Docent (Doktora / Sanatta yeterlik/ tip/dis uzmanlik unvanini aldiktan sonraki faaliyetleri esas alinacaktir)', userRole === 'docent' ? `[${checkMark}]` : '[ ]']);
      tableRows.push(['Dr. Ogretim Uyesi (Yeniden Atama: Son atama tarihinden basvuru tarihine kadar olmak uzere donem faaliyetleri esas alinacaktir)', userRole === 'dr_ogretim_uyesi' ? `[${checkMark}]` : '[ ]']);
      tableRows.push(['Dr. Ogretim Uyesi (Ilk Atama)', userRole === 'aday' ? `[${checkMark}]` : '[ ]']);
      
      // ETKİNLİK başlık satırı
      tableRows.push(['ETKINLIK', '']); // Başlık satırı
      
      // Minimum Puan Kriterleri başlık satırı
      if (criteria) {
        tableRows.push(['MINIMUM PUAN KRITERLERI', '']); // Başlık satırı
        tableRows.push(['Makaleler', criteria.makaleler_puani ? `${criteria.makaleler_puani}` : '0']);
        tableRows.push(['Bilimsel Toplanti Faaliyetleri', criteria.btf_puani ? `${criteria.btf_puani}` : '0']);
        tableRows.push(['Kitaplar', criteria.kitaplar_puani ? `${criteria.kitaplar_puani}` : '0']);
        tableRows.push(['Atiflar', criteria.atiflar_puan ? `${criteria.atiflar_puan}` : '0']);
      }
      
      // Puan Tablosu başlık satırı
      tableRows.push(['PUAN TABLOSU', '']); // Başlık satırı
      
      // Puan bölümlerini ekle
      for (const section in scores) {
        if (scores[section]) {
          const puan = scores[section].total || 0;
          tableRows.push([section, `${puan}`]);
        }
      }
      
      // Toplam puanı ekle
      const makaleler_puani = Number(scores['A. Makaleler']?.total || 0);
      const btf_puani = Number(scores['B. Bilimsel Toplantı Faaliyetleri']?.total || 0);
      const kitaplar_puani = Number(scores['C. Kitaplar']?.total || 0);
      const atiflar_puan = Number(scores['D. Atıflar']?.total || 0);
      const toplam_puan = makaleler_puani + btf_puani + kitaplar_puani + atiflar_puan;
      
      tableRows.push(['TOPLAM PUAN', `${toplam_puan}`]);
      
      // Tabloyu çiz, koyu yazı tipi için özel işlevsellikleri belirle
      const tableWidth = 500;
      const colWidths = [350, 150]; // Daha dengeli bir genişlik dağılımı
      
      // Her satırın koyu olup olmadığını belirleyen dizi
      const boldRows = [
        true,  // GENEL PUANLAMA BILGILERI
        false, // Adı Soyadı
        false, // Tarih
        false, // Bulunduğu Kurum
        false, // Başvurduğu Akademik Kadro
        false, // İmza
        true,  // PUANLANAN FAALIYET DONEMI
        false, // Profesor
        false, // Docent
        false, // Dr. Ogretim Uyesi (Yeniden)
        false, // Dr. Ogretim Uyesi (İlk)
        true,  // ETKINLIK
      ];
      
      // Kriterler varsa, boldRows dizisine eklemeler yap
      if (criteria) {
        boldRows.push(true);  // MINIMUM PUAN KRITERLERI
        boldRows.push(false); // Makaleler
        boldRows.push(false); // Bilimsel Toplanti
        boldRows.push(false); // Kitaplar
        boldRows.push(false); // Atiflar
      }
      
      boldRows.push(true); // PUAN TABLOSU
      
      // Puan bölümleri için normal satırlar
      for (const section in scores) {
        if (scores[section]) {
          boldRows.push(false);
        }
      }
      
      boldRows.push(true); // TOPLAM PUAN (koyu olsun)
      
      // Özel tablo çizme fonksiyonu - başlık satırları koyu olacak
      const drawFormattedTable = (page, x, y, rows, colWidths, boldRows) => {
        const startX = x;
        let currentY = y;
        const rowHeight = 30;
        
        // Her satır için
        for (let i = 0; i < rows.length; i++) {
          let currentX = startX;
          const row = rows[i];
          const isBold = boldRows[i] || false;
          
          // Satır çizgisi
          page.drawLine({
            start: { x: startX, y: currentY },
            end: { x: startX + colWidths.reduce((a, b) => a + b, 0), y: currentY },
            thickness: 1,
            color: rgb(0, 0, 0),
          });
          
          // Her hücre için
          for (let j = 0; j < row.length; j++) {
            const cellText = row[j] || '';
            const cellValue = turkishToAscii(cellText);
            
            // Dikey çizgi
            page.drawLine({
              start: { x: currentX, y: currentY },
              end: { x: currentX, y: currentY - rowHeight },
              thickness: 1,
              color: rgb(0, 0, 0),
            });
            
            // Hücre arka plan rengini belirle (isteğe bağlı)
            if (isBold) {
              // Başlık satırı için hafif gri arka plan (isteğe bağlı)
              page.drawRectangle({
                x: currentX,
                y: currentY - rowHeight,
                width: colWidths[j],
                height: rowHeight,
                color: rgb(0.9, 0.9, 0.9), // Açık gri
              });
            }
            
            // Uzun metinleri kısalt
            let displayText = cellValue;
            if (cellValue.length > 60 && j === 0) {
              displayText = cellValue.substring(0, 57) + '...';
            }
            
            // Hücre metni
            page.drawText(displayText, {
              x: currentX + 5,
              y: currentY - rowHeight + 10,
              size: isBold ? 12 : 10,
              font: isBold ? boldFont : font,
            });
            
            currentX += colWidths[j];
            
            // Son sütun için dikey çizgi
            if (j === row.length - 1) {
              page.drawLine({
                start: { x: currentX, y: currentY },
                end: { x: currentX, y: currentY - rowHeight },
                thickness: 1,
                color: rgb(0, 0, 0),
              });
            }
          }
          
          currentY -= rowHeight;
        }
        
        // Son satır çizgisi
        page.drawLine({
          start: { x: startX, y: currentY },
          end: { x: startX + colWidths.reduce((a, b) => a + b, 0), y: currentY },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
        
        return currentY; // Tablonun bittiği Y koordinatını döndür
      };
      
      // Tabloyu çiz
      y = drawFormattedTable(page, margin, y, tableRows, colWidths, boldRows);
      
      // Alt bilgi tarih
      const dateText = turkishToAscii(`Olusturulma Tarihi: ${formattedToday}`);
      page.drawText(dateText, {
        x: margin,
        y: 30,
        size: 10,
        font: font
      });
      
      // PDF kaydet ve indir
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      
      // Dosya adı (Türkçe karakterleri ASCII'ye dönüştür)
      let fileName = '';
      if (userData && userData.ad && userData.soyad) {
        const safeAd = turkishToAscii(userData.ad);
        const safeSoyad = turkishToAscii(userData.soyad);
        fileName = `Basvuru_${basvuruId || 'Belirtilmemis'}_${safeAd}_${safeSoyad}.pdf`;
      } else {
        fileName = `Basvuru_${basvuruId || 'Belirtilmemis'}.pdf`;
      }
      
      link.download = fileName;
      console.log('PDF indirme bağlantısı hazır, dosya adı:', fileName);
      link.click();
      console.log('PDF indirme başlatıldı');
      
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      setMessage(`PDF oluşturulurken bir hata oluştu: ${error.message || 'Bilinmeyen hata'}`);
    } finally {
      setPdfLoading(false);
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
          {userData && (
            <div className="applicant-info">
              <h3>Aday Bilgileri</h3>
              <p><strong>Ad Soyad:</strong> {userData.ad} {userData.soyad}</p>
              <p><strong>E-posta:</strong> {userData.email}</p>
            </div>
          )}

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

      <div className="buttons-container">
        <button
          className="apply-button"
          onClick={handleApply}
          disabled={loading || validationErrors.length > 0}
        >
          {loading ? 'Kaydediliyor...' : 'Başvur'}
        </button>

        <button 
          className="export-pdf-button" 
          onClick={generatePDF}
          disabled={pdfLoading || Object.keys(scores).length === 0}
        >
          {pdfLoading ? 'PDF Hazırlanıyor...' : 'PDF İndir'}
        </button>

        <button className="go-back-button" onClick={() => navigate(-1)}>
          Geri Dön
        </button>
      </div>
    </div>
  );
};

export default ScoreSummary;