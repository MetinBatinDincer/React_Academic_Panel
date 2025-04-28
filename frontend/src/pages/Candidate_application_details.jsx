import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { calculateCombinedScore } from '../utils/calculateScores';
import './css/Candidate_application_details.css';
import axios from 'axios';

const FIELD_MAP = {
  'A. Makaleler': [
    'Yazar/Yazarlar',
    'Makale Adı',
    'Dergi Adı',
    'Cilt No.',
    'Sayfa',
    'Yıl'
  ],


  'B. Bilimsel Toplantı Faaliyetleri': ['Yazar/Yazarlar', 'Bildiri Adı', 'Konferansın Adı', 'Yapıldığı Yer', 'Sayfa Sayıları', 'Tarih'],
  'C. Kitaplar': ['Yazar/Yazarlar', 'Kitap Adı', 'Yayınevi', 'Baskı Sayısı', 'Yayımlandığı Yer', 'Yıl'],
  'D. Atıflar': ['Atıfın Yapıldığı Eser', 'Atıf Sayısı'],
  'E. Eğitim Öğretim Faaliyetleri': ['Dersin Adı', 'Programın Adı', 'Dönemi', 'Yılı'],
  'F. Tez Yöneticiliği': ['Öğrenci Adı', 'Tezin Adı', 'Enstitüsü', 'Yılı'],
  'G. Patentler': ['Patent Adı', 'Yılı'],
  'H. Araştırma Projeleri': ['Projenin Adı', 'Proje Numarası', 'Projenin Yürütüldüğü Kurumun Adı', 'Yılı'],
  'I. Editörlük, Yayın Kurulu Üyeliği ve Hakemlik Faaliyetleri': ['Derginin Adı', 'Sayısı', 'Yılı'],
  'J. Ödüller': ['Ödülün Veren Kurul/Kurumun Adı', 'Yılı'],
  'K. İdari Görevler ve Üniversiteye Katkı Faaliyetleri': ['Görev Birimi', 'Yılı'],
  'L. Güzel Sanatlar Faaliyetleri': ['Faaliyet Adı', 'Yılı']
};

const CandidateApplicationDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedTexts = location.state?.selectedTexts || [];
  const { state } = useLocation();
  const { ilanId } = state || {};
  const { basvuru } = state || {};

  

  const [entries, setEntries] = useState(() =>
    selectedTexts.reduce((acc, { section, text }) => {
      const key = `${section} - ${text}`;
      const fields = FIELD_MAP[section] || ['Başlık', 'Yıl', 'Açıklama'];
      const initialData = Object.fromEntries(fields.map(f => [f, '']));

      if (section === 'A. Makaleler') {
        acc[key] = [{ ...initialData, role: '', sameRoleCount: '', roleIndex: '',isInterInstitutional: false,
          isReviewArticle: false,
          isFirstOrCorrespondingAuthor: false,
          isEqualFirstOrCorrespondingAuthor: false }];
      }
      else if (section === 'C. Kitaplar') {
        acc[key] = [{ ...initialData, role: '', sameRoleCount: '', roleIndex: '' ,isInterInstitutional: false,
          isReviewArticle: false,
          isFirstOrCorrespondingAuthor: false,
          isEqualFirstOrCorrespondingAuthor: false}];
        acc[key] = [{ ...initialData, isForeign: false }];
      }

      else if (section === 'B. Bilimsel Toplantı Faaliyetleri') {
        acc[key] = [{ ...initialData, role: '', sameRoleCount: '', roleIndex: '' ,isInterInstitutional: false,
          isReviewArticle: false,
          isFirstOrCorrespondingAuthor: false,
          isEqualFirstOrCorrespondingAuthor: false}];
      }
      else if (section === 'G. Patentler') {
        acc[key] = [{ ...initialData, role: '', sameRoleCount: '', roleIndex: '' ,isInterInstitutional: false,
          isReviewArticle: false,
          isFirstOrCorrespondingAuthor: false,
          isEqualFirstOrCorrespondingAuthor: false}];
        
      } else if (section === 'E. Eğitim Öğretim Faaliyetleri') {
        acc[key] = [{ ...initialData, isAfterPhD: false, isForeignLang: false }];
      } else {
        acc[key] = [initialData];
      }

      return acc;
    }, {})
  );

  const handleChange = (key, index, field, value) => {
    const updated = [...entries[key]];

    if (field === 'roleIndex' && updated[index].sameRoleCount) {
      const max = parseInt(updated[index].sameRoleCount);
      const current = parseInt(value);
      if (current > max) return;
    }

    updated[index][field] = value;
    setEntries({ ...entries, [key]: updated });
  };


  const toggleIsForeign = (key, index) => {
    const updated = [...entries[key]];
    updated[index].isForeign = !updated[index].isForeign;
    setEntries({ ...entries, [key]: updated });
  };

  const toggleIsForeignLang = (key, index) => {
    const updated = [...entries[key]];
    updated[index].isForeignLang = !updated[index].isForeignLang;
    setEntries({ ...entries, [key]: updated });
  };

  const toggleIsAfterPhD = (key, index) => {
    const updated = [...entries[key]];
    updated[index].isAfterPhD = !updated[index].isAfterPhD;
    setEntries({ ...entries, [key]: updated });
  };

  const handleAddEntry = (key) => {
    const fields = Object.keys(entries[key][0]).filter(f => f !== 'isForeign' && f !== 'isAfterPhD' && f !== 'isForeignLang');
    const newEntry = Object.fromEntries(fields.map(f => [f, '']));

    const extraFlags = {};
    if (key.startsWith('C. Kitaplar')) extraFlags.isForeign = false;
    if (key.startsWith('E. Eğitim Öğretim Faaliyetleri')) {
      extraFlags.isAfterPhD = false;
      extraFlags.isForeignLang = false;
    }

    setEntries({
      ...entries,
      [key]: [...entries[key], { ...newEntry, ...extraFlags }]
    });
  };

  const handleDeleteEntry = (key, index) => {
    const updated = entries[key].filter((_, i) => i !== index);
    const fields = Object.keys(entries[key][0]);
    const base = Object.fromEntries(fields.map(f => [f, f.startsWith("is") ? false : '']));
    setEntries({ ...entries, [key]: updated.length ? updated : [base] });
  };

  const handleSubmit = async () => {
    try {
      // Token'ı localStorage'dan al
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        navigate('/login');
        return;
      }

      // Axios için header'ları ayarla
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      // basvuru_id'nin sayı olduğundan emin ol
      const basvuruId = parseInt(basvuru);
      if (isNaN(basvuruId)) {
        alert('Geçersiz başvuru ID');
        return;
      }

      // Makaleleri gönder
      const makaleler = Object.entries(entries)
        .filter(([key]) => key.startsWith('A. Makaleler'))
        .flatMap(([_, items]) => items.map(item => ({
          basvuru_id: basvuruId,
          kategori: 'Makale',
          yazar: item['Yazar/Yazarlar'],
          makale_ad: item['Makale Adı'],
          dergi_ad: item['Dergi Adı'],
          cilt_no: item['Cilt No.'],
          sayfa: item['Sayfa'],
          yil: item['Yıl']
        })));

      // BTF'leri gönder
      const btfler = Object.entries(entries)
        .filter(([key]) => key.startsWith('B. Bilimsel Toplantı Faaliyetleri'))
        .flatMap(([_, items]) => items.map(item => ({
          basvuru_id: basvuruId,
          kategori: 'BTF',
          yazar: item['Yazar/Yazarlar'],
          bildiri_adi: item['Bildiri Adı'],
          konferans_adi: item['Konferansın Adı'],
          yapildigi_yer: item['Yapıldığı Yer'],
          sayfa_sayilari: parseInt(item['Sayfa Sayıları']),
          tarih: item['Tarih']
        })));

      // Kitapları gönder
      const kitaplar = Object.entries(entries)
        .filter(([key]) => key.startsWith('C. Kitaplar'))
        .flatMap(([_, items]) => items.map(item => ({
          basvuru_id: basvuruId,
          kategori: 'Kitap',
          yazar: item['Yazar/Yazarlar'],
          kitap_adi: item['Kitap Adı'],
          yayinevi: item['Yayınevi'],
          baski_sayisi: parseInt(item['Baskı Sayısı']),
          yayimlandigi_yer: item['Yayımlandığı Yer'],
          yil: item['Yıl']
        })));

      // Atıfları gönder
      const atiflar = Object.entries(entries)
        .filter(([key]) => key.startsWith('D. Atıflar'))
        .flatMap(([_, items]) => items.map(item => ({
          basvuru_id: basvuruId,
          kategori: 'Atıf',
          atif_yapilan_yazar: item['Yazar/Yazarlar'] || '',
          atif_yapilan_makale: item['Atıfın Yapıldığı Eser'],
          atif_yapan_yazar: '',
          atif_yapan_makale: '',
          atif_yili: new Date().getFullYear()
        })));

      // Verileri backend'e gönder
      const baseUrl = 'http://localhost:5000/api/basvurular';
      
      // Debug için konsola yazdır
      console.log('Gönderilecek basvuru_id:', basvuruId);
      console.log('Örnek makale verisi:', makaleler[0]);

      // Makaleleri kaydet
      for (const makale of makaleler) {
        await axios.post(`${baseUrl}/${basvuruId}/makaleler`, makale, config);
      }

      // BTF'leri kaydet
      for (const btf of btfler) {
        await axios.post(`${baseUrl}/${basvuruId}/btf`, btf, config);
      }

      // Kitapları kaydet
      for (const kitap of kitaplar) {
        await axios.post(`${baseUrl}/${basvuruId}/kitaplar`, kitap, config);
      }

      // Atıfları kaydet
      for (const atif of atiflar) {
        await axios.post(`${baseUrl}/${basvuruId}/atiflar`, atif, config);
      }

      // Puanları hesapla ve puan özetine yönlendir
      const scores = calculateCombinedScore(entries);
      navigate('/puan-ozeti', { state: { scores, entries, ilanId, basvuru } });
    } catch (error) {
      console.error('Veri gönderme hatası:', error);
      if (error.response?.data?.error === 'Token bulunamadı') {
        alert('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        navigate('/login');
      } else {
        alert('Veriler kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  return (
    <div className="details-container">
      <div className="details-title-block">
        <h5 className="details-title">Kocaeli Üniversitesi Bilgi Merkezi <span className="line" /></h5>
        <h2 className="details-subtitle">Detaylı Başvuru Bilgileri{ilanId} {basvuru}</h2>
      </div>

      {Object.entries(entries).map(([key, items]) => (
        <div key={key} className="entry-group">
          <h3>{key}</h3>
          {key.startsWith("D. Atıflar") && (
            <p className="citation-note">
              *Atıf yapan eserlerin belgelenmesi kaydıyla, bu yönetmeliğin Temel İlkeler bölümündeki atıflara ilişkin açıklamalar dikkate alınır*
            </p>
          )}
          {key.startsWith("F. Tez Yöneticiliği") && (
            <p className="citation-note">
              *Tamamlanmış olması kaydıyla*
            </p>
          )}


          {items.map((item, index) => (
            <div key={index} className="entry-form">
              {Object.entries(item).map(([field, value]) => {

                if (
                  field.startsWith('is') ||
                  field === 'authorRole' ||
                  field === 'authorPosition' ||
                  field === 'authorCount' ||
                  field === 'role' ||
                  field === 'sameRoleCount' ||
                  field === 'roleIndex'
                ) return null;
                return (
                  <input
                    key={field}
                    type="text"
                    placeholder={field}
                    value={value}
                    onChange={(e) => handleChange(key, index, field, e.target.value)}
                    disabled={key.startsWith('E. Eğitim Öğretim Faaliyetleri') && !item.isAfterPhD}
                  />
                );
              })}
              {['A. Makaleler', 'B. Bilimsel Toplantı Faaliyetleri', 'C. Kitaplar', 'G. Patentler'].some(s => key.startsWith(s)) && (
  <div className="author-role-fields">
  <div className="role-inputs">
    <label>
      Yazar Rolü:
      <select value={item.role || ''} onChange={(e) => handleChange(key, index, 'role', e.target.value)}>
        <option value="">Seçiniz</option>
        <option value="ogrenci">Lisansüstü Öğrenci</option>
        <option value="danisman">Danışman</option>
        <option value="esdanisman">Eş Danışman</option>
        <option value="diger">Diğer</option>
      </select>
    </label>

    <label>
      Aynı Rolde Kaç Kişi Var:
      <input
        type="number"
        min="1"
        value={item.sameRoleCount || ''}
        onChange={(e) => handleChange(key, index, 'sameRoleCount', e.target.value)}
      />
    </label>

    <label>
      Bu Rolde Kaçıncı Kişi:
      <input
        type="number"
        min="1"
        max={parseInt(item.sameRoleCount) || undefined}
        value={item.roleIndex || ''}
        onChange={(e) => handleChange(key, index, 'roleIndex', e.target.value)}
      />
    </label>
  </div>

  <div className="checkbox-bonus-group-inline">
    <label>
      <input
        type="checkbox"
        checked={item.isInterInstitutional || false}
        onChange={(e) => handleChange(key, index, 'isInterInstitutional', e.target.checked)}
      />
      Üniversitelerarası İşbirliği (%30)
    </label>
    <label>
      <input
        type="checkbox"
        checked={item.isReviewArticle || false}
        onChange={(e) => handleChange(key, index, 'isReviewArticle', e.target.checked)}
      />
      Derleme Makale (%20)
    </label>
    <label>
      <input
        type="checkbox"
        checked={item.isFirstOrCorrespondingAuthor || false}
        onChange={(e) => handleChange(key, index, 'isFirstOrCorrespondingAuthor', e.target.checked)}
      />
      İlk/Sorumlu Yazar (%80)
    </label>
    <label>
      <input
        type="checkbox"
        checked={item.isEqualFirstOrCorrespondingAuthor || false}
        onChange={(e) => handleChange(key, index, 'isEqualFirstOrCorrespondingAuthor', e.target.checked)}
      />
      Eşit İlk/Sorumlu Yazar (%40)
    </label>
  </div>
</div>

)}





              <div className="entry-actions">
                <button className="delete-button" onClick={() => handleDeleteEntry(key, index)}>Sil</button>

                {key.startsWith('C. Kitaplar') && (
                  <span className={`foreign-toggle ${item.isForeign ? 'active' : ''}`} onClick={() => toggleIsForeign(key, index)}>
                    Yabancı Dilde
                  </span>
                )}

                {key.startsWith('E. Eğitim Öğretim Faaliyetleri') && (
                  <>
                    <span className={`doctorate-toggle ${item.isAfterPhD ? 'active' : ''}`} onClick={() => toggleIsAfterPhD(key, index)}>
                      Doktora Sonrası
                    </span>
                    <span className={`doctorate-toggle ${item.isForeignLang ? 'active' : ''}`} onClick={() => toggleIsForeignLang(key, index)}>
                      Yabancı Dilde
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}

          <button className="add-button" onClick={() => handleAddEntry(key)}>+ Ekle</button>
        </div>
      ))}

      <button className="submit-button" onClick={handleSubmit}>Gönder</button>
    </div>
  );
};

export default CandidateApplicationDetails;
