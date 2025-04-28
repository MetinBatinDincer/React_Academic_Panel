import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './css/Candidate_evaluation.css';
import Footer from '../Components/footer';
import axios from 'axios';

// 🔹 Random puan üretici (korundu, kullanılmıyor)
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateFakeDetail = (key) => {
  switch (key.toLowerCase()) {
    case "yazar":
      return "Dr. Ayşe Yılmaz";
    case "makaleadi":
    case "makaleAdi":
      return "Yapay Zekâ Tabanlı Sınıflandırıcılar";
    case "dergi":
      return "International Journal of AI";
    case "kaynak":
      return "TÜBİTAK Projesi 2023";
    case "yıl":
      return `${randomBetween(2015, 2024)}`;
    case "dersadi":
    case "ders":
      return "Bilgisayar Mimarisi";
    case "dönem":
      return "Güz 2023";
    default:
      return "Otomatik veri";
  }
};

function Candidate_evaluation() {
  const { role } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Debug logs for location state
  console.log('Location state:', location.state);
  console.log('BasvuruId from location:', location.state?.basvuruId);

  const basvuruId = location.state?.basvuruId;

  // Redirect if no basvuruId
  useEffect(() => {
    if (!basvuruId) {
      console.error('BasvuruId not found in location state');
      navigate('/dashboard');
    }
  }, [basvuruId, navigate]);

  const [yorum, setYorum] = useState('');
  const [durum, setDurum] = useState('');
  const [akademikFaaliyetler, setAkademikFaaliyetler] = useState({
    makaleler: [],
    btf: [],
    kitaplar: [],
    atiflar: []
  });
  const [puanlar, setPuanlar] = useState(null);
  const [juriPuanlari, setJuriPuanlari] = useState({
    makaleler: 0,
    btf: 0,
    kitaplar: 0,
    atiflar: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API'den veri çekme
  useEffect(() => {
    const fetchData = async () => {
      if (!basvuruId) return;

      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      try {
        // Önce puanları getir
        try {
          const puanlarRes = await axios.get(`http://localhost:5000/api/basvurular/${basvuruId}/puanlar`, config);
          console.log('Puanlar response:', puanlarRes.data);
          if (puanlarRes.data) {
            setPuanlar(puanlarRes.data);
            // Mevcut jüri puanlarını input alanları için set et
            const juriPuanlar = {
              makaleler: Math.round(Number(puanlarRes.data.juri_makaleler_puani)) || 0,
              btf: Math.round(Number(puanlarRes.data.juri_btf_puani)) || 0,
              kitaplar: Math.round(Number(puanlarRes.data.juri_kitaplar_puani)) || 0,
              atiflar: Math.round(Number(puanlarRes.data.juri_atiflar_puan)) || 0
            };
            setJuriPuanlari(juriPuanlar);
          }
        } catch (err) {
          console.error('Puanlar getirme hatası:', err.response?.data || err.message);
        }

        // Değerlendirme bilgilerini getir
        try {
          const degerlendirmeRes = await axios.get(`http://localhost:5000/api/basvurular/${basvuruId}/degerlendirme`, config);
          console.log('Değerlendirme response:', degerlendirmeRes.data);
          if (degerlendirmeRes.data) {
            const degerlendirmeData = degerlendirmeRes.data;
            setYorum(degerlendirmeData.degerlendirme_metni || '');
            setDurum(degerlendirmeData.durum || '');
          }
        } catch (err) {
          console.error('Değerlendirme getirme hatası:', err.response?.data || err.message);
        }

        // Makaleleri getir
        try {
          console.log('Makaleler API çağrısı yapılıyor:', `http://localhost:5000/api/basvurular/${basvuruId}/makaleler`);
          const makalelerRes = await axios.get(`http://localhost:5000/api/basvurular/${basvuruId}/makaleler`, config);
          console.log('Makaleler ham response:', makalelerRes);
          console.log('Makaleler response data:', makalelerRes.data);
          const makalelerData = makalelerRes.data || [];
          console.log('İşlenmiş makale verileri:', makalelerData);
          setAkademikFaaliyetler(prev => {
            const newState = { ...prev, makaleler: makalelerData };
            console.log('Güncellenmiş akademikFaaliyetler state:', newState);
            return newState;
          });
        } catch (err) {
          console.error('Makaleler getirme hatası detayı:', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status
          });
        }

        // BTF getir
        try {
          const btfRes = await axios.get(`http://localhost:5000/api/basvurular/${basvuruId}/btf`, config);
          console.log('BTF response:', btfRes.data);
          const btfData = btfRes.data || [];
          setAkademikFaaliyetler(prev => ({ ...prev, btf: btfData }));
        } catch (err) {
          console.error('BTF getirme hatası:', err.response?.data || err.message);
        }

        // Kitapları getir
        try {
          console.log('Kitaplar API çağrısı yapılıyor:', `http://localhost:5000/api/basvurular/${basvuruId}/kitaplar`);
          const kitaplarRes = await axios.get(`http://localhost:5000/api/basvurular/${basvuruId}/kitaplar`, config);
          console.log('Kitaplar ham response:', kitaplarRes);
          console.log('Kitaplar response data:', kitaplarRes.data);
          const kitaplarData = kitaplarRes.data || [];
          console.log('İşlenmiş kitap verileri:', kitaplarData);
          setAkademikFaaliyetler(prev => {
            const newState = { ...prev, kitaplar: kitaplarData };
            console.log('Güncellenmiş akademikFaaliyetler state (kitaplar):', newState);
            return newState;
          });
        } catch (err) {
          console.error('Kitaplar getirme hatası detayı:', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status
          });
        }

        // Atıfları getir
        try {
          const atiflarRes = await axios.get(`http://localhost:5000/api/basvurular/${basvuruId}/atiflar`, config);
          console.log('Atıflar response:', atiflarRes.data);
          const atiflarData = atiflarRes.data || [];
          setAkademikFaaliyetler(prev => ({ ...prev, atiflar: atiflarData }));
        } catch (err) {
          console.error('Atıflar getirme hatası:', err.response?.data || err.message);
        }

        setLoading(false);
      } catch (err) {
        console.error('Genel veri getirme hatası:', err.response?.data || err.message);
        setError('Veriler yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    };

    fetchData();
  }, [basvuruId, navigate]);

  // Jüri puanı değiştirme handler'ı
  const handleJuriPuaniChange = (kategori, yeniPuan) => {
    const puan = Math.round(Number(yeniPuan));
    if (puan > 100) {
      alert('Jüri puanı maksimum 100 olabilir!');
      setJuriPuanlari(prev => ({
        ...prev,
        [kategori]: 100
      }));
    } else if (puan < 0 || isNaN(puan)) {
      setJuriPuanlari(prev => ({
        ...prev,
        [kategori]: 0
      }));
    } else {
      setJuriPuanlari(prev => ({
        ...prev,
        [kategori]: puan
      }));
    }
  };

  // Kaydetme işlemi
  const handleKaydet = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
        navigate('/login');
        return;
      }

      // Gerekli alanların kontrolü
      if (!yorum || yorum.trim() === '') {
        alert('Lütfen jüri yorumu giriniz.');
        return;
      }

      if (!durum) {
        alert('Lütfen adayın uygunluk durumunu seçiniz.');
        return;
      }

      // Puanların 100'den büyük olup olmadığını kontrol et
      for (const [kategori, puan] of Object.entries(juriPuanlari)) {
        if (puan > 100) {
          alert(`${kategori} için jüri puanı maksimum 100 olabilir!`);
          return;
        }
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Toplam puanı hesapla
      const toplamPuan = Object.values(juriPuanlari).reduce((acc, curr) => acc + Number(curr) || 0, 0);

      // Backend'e gönderilecek veriyi hazırla
      const requestData = {
        degerlendirme_metni: yorum,
        durum: durum,
        makaleler_puani: Number(juriPuanlari.makaleler) || 0,
        btf_puani: Number(juriPuanlari.btf) || 0,
        kitaplar_puani: Number(juriPuanlari.kitaplar) || 0,
        atiflar_puani: Number(juriPuanlari.atiflar) || 0,
        toplam_puan: toplamPuan,
        juri_raporu: durum, // Adayın uygunluk durumu (uygun/uygun_degil)
        juri_yorumu: yorum // Jüri yorumu
      };

      console.log('Gönderilen değerlendirme verisi:', requestData);

      // Önce mevcut değerlendirmeyi kontrol et
      let response;
      try {
        const checkResponse = await axios.get(
          `http://localhost:5000/api/basvurular/${basvuruId}/degerlendirme`,
          config
        );
        
        // Eğer değerlendirme varsa PUT ile güncelle
        if (checkResponse.data) {
          response = await axios.put(
            `http://localhost:5000/api/basvurular/${basvuruId}/degerlendirme`,
            requestData,
            config
          );
        } else {
          // Değerlendirme yoksa POST ile yeni oluştur
          response = await axios.post(
            `http://localhost:5000/api/basvurular/${basvuruId}/degerlendirme`,
            requestData,
            config
          );
        }
      } catch (err) {
        // Eğer değerlendirme bulunamazsa (404) veya başka bir hata olursa POST ile yeni oluştur
        response = await axios.post(
          `http://localhost:5000/api/basvurular/${basvuruId}/degerlendirme`,
          requestData,
          config
        );
      }

      if (response.data.message) {
        alert(response.data.message);
        navigate('/Jury_Menu');
      }
    } catch (err) {
      console.error('Kaydetme hatası:', err.response?.data || err);
      let errorMessage = 'Değerlendirme kaydedilirken bir hata oluştu.';
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Oturumunuz sona ermiş. Lütfen tekrar giriş yapın.';
          navigate('/login');
        } else if (err.response.status === 403) {
          errorMessage = 'Bu işlem için yetkiniz bulunmamaktadır.';
        } else if (err.response.data?.error) {
          errorMessage = err.response.data.error;
        }
      }
      
      alert(errorMessage);
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Kategorileri tanımla
  const kategoriler = [
    {
      id: 'makaleler',
      baslik: 'A. Makaleler',
      veriler: akademikFaaliyetler.makaleler,
      detaylar: ['yazar', 'makale_ad', 'dergi_ad', 'yil'],
      sistemPuani: puanlar?.makaleler_puani || 0,
      juriPuani: puanlar?.juri_makaleler_puani || 0
    },
    {
      id: 'btf',
      baslik: 'B. Bilimsel Toplantı Faaliyetleri',
      veriler: akademikFaaliyetler.btf,
      detaylar: ['yazar', 'bildiri_adi', 'konferans_adi', 'tarih'],
      sistemPuani: puanlar?.btf_puani || 0,
      juriPuani: puanlar?.juri_btf_puani || 0
    },
    {
      id: 'kitaplar',
      baslik: 'C. Kitaplar',
      veriler: akademikFaaliyetler.kitaplar,
      detaylar: ['yazar', 'kitap_adi', 'yayinevi', 'yil'],
      sistemPuani: puanlar?.kitaplar_puani || 0,
      juriPuani: puanlar?.juri_kitaplar_puani || 0
    },
    {
      id: 'atiflar',
      baslik: 'D. Atıflar',
      veriler: akademikFaaliyetler.atiflar,
      detaylar: ['atif_yapilan_makale', 'atif_yapan_yazar', 'atif_yili'],
      sistemPuani: puanlar?.atiflar_puani || 0,
      juriPuani: puanlar?.juri_atiflar_puan || 0
    }
  ];

  return (
    <div>
      <div className="Candidate_evaluation-allof">
        <div className="baslikortala">
          <div className="Candidate_evaluation-title-line">
            <h5>Kocaeli Üniversitesi Bilgi Merkezi</h5>
            <span className="line"></span>
          </div>
        </div>

        <div className="allof2">
          <div className="Candidate_evaluation-container">
            <div className="Candidate_evaluation-content">
              <div className="Candidate_evaluation-card">
                <div className="Candidate_evaluation-image-box"></div>
                <div className="Candidate_evaluation-text">
                  <h2>Duyuru İçeriği ({role})</h2>
                  <p>{role} unvanı için değerlendirme formu sayfası</p>
                </div>
              </div>
            </div>
          </div>

          <div className="Candidate_evaluation-containersag">
            <div className="baslikortala1">
              <div className="Candidate_evaluation-title-line1">
                <h5>Kocaeli Üniversitesi</h5>
                <span className="line1"></span>
              </div>

              <p className="aciklama-yazi">
                Öğretim Üyeliklerine Atama İçin Yapılan Başvurularda Adayların Yayın,
                Eğitim-Öğretim ve Diğer Faaliyetlerinin Değerlendirilmesine İlişkin Genel Puanlama Bilgileri
              </p>
            </div>

            <div className="kisiBilgileri">
              <h3 className="puanlama-baslik">Akademik Değerlendirme Formu</h3>

              {kategoriler.map(kategori => (
                <div key={kategori.id} className="puan-kategori">
                  <h4>{kategori.baslik}</h4>
                  {kategori.veriler.length === 0 ? (
                    <p>Bu kategoride veri bulunmamaktadır.</p>
                  ) : (
                    kategori.veriler.map((veri, index) => (
                      <div key={index} className="puan-satiri">
                        <div className="puan-ust">
                          <span className="puan-kriter">
                            {veri[kategori.detaylar[1]] || 'Bilinmeyen Veri'}
                          </span>
                          <span className="puan-sistem">Sistem Puanı: {kategori.sistemPuani}</span>
                          <input
                            type="number"
                            placeholder="Jüri Puanı"
                            className="puan-input"
                            value={Math.round(juriPuanlari[kategori.id])}
                            max="100"
                            min="0"
                            onChange={(e) => handleJuriPuaniChange(kategori.id, e.target.value)}
                            onBlur={(e) => {
                              if (Number(e.target.value) > 100) {
                                alert('Jüri puanı maksimum 100 olabilir!');
                                handleJuriPuaniChange(kategori.id, 100);
                              }
                            }}
                          />
                        </div>
                        
                        <div className="alt-detaylar">
                          {kategori.detaylar.map(key => (
                            <div key={key} className="alt-detay-item">
                              <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                              <span className="alt-detay-deger">{veri[key] || 'Bilinmeyen'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ))}

              <div className="juriYorumu">
                <textarea
                  placeholder="Jüri yorumu giriniz..."
                  value={yorum}
                  onChange={e => setYorum(e.target.value)}
                ></textarea>
              </div>

              <div className="radio-checkbox-group">
                <label className="custom-radio">
                  <input
                    type="radio"
                    name="kisiDurumu"
                    value="uygun"
                    checked={durum === 'uygun'}
                    onChange={() => setDurum('uygun')}
                  />
                  <span className="checkmark"></span>
                  Aday pozisyon için uygundur
                </label>

                <label className="custom-radio">
                  <input
                    type="radio"
                    name="kisiDurumu"
                    value="uygun_degil"
                    checked={durum === 'uygun_degil'}
                    onChange={() => setDurum('uygun_degil')}
                  />
                  <span className="checkmark"></span>
                  Aday pozisyon için uygun değildir
                </label>
              </div>

              <div className="kategori-toplamlari">
                {kategoriler.map(kategori => {
                  const sistemToplam = Math.round(kategori.sistemPuani);
                  const juriToplam = Math.round(juriPuanlari[kategori.id]);

                  return (
                    <div key={kategori.id} className="kategori-toplam">
                      <strong>{kategori.baslik}:</strong> Sistem Toplamı: {sistemToplam} | Jüri Toplamı: {juriToplam}
                    </div>
                  );
                })}

                <div className="kategori-toplam genel-toplam">
                  <strong>Genel Toplam:</strong> Sistem:{' '}
                  {Math.round(puanlar?.toplam_puan || 0)}{' '}
                  | Jüri:{' '}
                  {Math.round(Object.values(juriPuanlari).reduce((acc, curr) => acc + Number(curr), 0))}
                </div>
              </div>

              <div className="kaydet-button-wrapper">
                <button className="kaydet-button" onClick={handleKaydet}>
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Candidate_evaluation;