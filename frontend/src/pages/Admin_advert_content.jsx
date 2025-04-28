import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/adminAdvertContent.css';
import Footer from '../Components/footer';

function Admin_advert_content() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [advert, setAdvert] = useState(null);
  const [requiredDocs, setRequiredDocs] = useState([]);
  const [allDocTypes, setAllDocTypes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedStartDate, setEditedStartDate] = useState('');
  const [editedEndDate, setEditedEndDate] = useState('');
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [evaluatingApplicantId, setEvaluatingApplicantId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const token = localStorage.getItem('token');

    // İlan bilgilerini çek
    axios.get('http://localhost:5000/api/ilanlar')
      .then((response) => {
        const ilanlar = response.data.ilanlar;
        const foundAdvert = ilanlar.find((item) => item.id.toString() === id);
        if (foundAdvert) {
          setAdvert(foundAdvert);
          setEditedTitle(foundAdvert.baslik);
          setEditedDescription(foundAdvert.aciklama);
          setEditedStartDate(foundAdvert.baslangic_tarihi);
          setEditedEndDate(foundAdvert.bitis_tarihi);
        } else {
          console.error('İlan bulunamadı.');
        }
      })
      .catch((error) => console.error('İlan içeriği çekilemedi:', error));

    // Gerekli belgeleri çek
    if (id) {
      axios.get(`http://localhost:5000/api/admin/ilan-belge-turleri/${id}/belge-turleri`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          console.log('Gerekli Belgeler:', response.data);
          setRequiredDocs(response.data);
          setSelectedDocs(response.data.map(doc => doc.id));
        })
        .catch((error) => console.error('Gerekli belge türleri alınamadı:', error));
    }

    // Tüm belge türlerini çek
    axios.get('http://localhost:5000/api/belge_turleri', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => setAllDocTypes(response.data))
      .catch((error) => console.error('Tüm belge türleri alınamadı:', error));

    // İlgili ilana ait başvuru yapan adayları getir (admin için)
    axios.get('http://localhost:5000/api/basvurular/all', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        // ilan_id ile filtreleme (ID string olduğu için dönüştürme yapılabilir)
        const filteredApplicants = response.data.filter(app => app.ilan_id.toString() === id);
        setApplicants(filteredApplicants);
      })
      .catch(error => console.error('Başvuru yapanlar alınamadı:', error));

  }, [id]);

  // Sayfalama
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentApplicants = applicants.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(applicants.length / itemsPerPage);

  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const handleDeğerlendir = (applicantId) => {
    console.log('Değerlendir butonuna tıklandı, aday id:', applicantId);
    setEvaluatingApplicantId(applicantId);
  };

  const updateApplicantStatus = (applicantId, newStatus) => {
    const token = localStorage.getItem('token');
    axios.put(`http://localhost:5000/api/basvurular/${applicantId}/status`, { durum: newStatus }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        setApplicants(prev =>
          prev.map(app => app.id === applicantId ? { ...app, durum: newStatus } : app)
        );
        setEvaluatingApplicantId(null);
      })
      .catch((error) => {
        console.error("Başvuru durumu güncellenirken hata:", error.response?.data || error.message);
        alert("Başvuru durumu güncellenirken hata oluştu.");
      });
  };

  const toggleEditMode = () => setEditMode(true);

  const handleDocSelection = (docId) => {
    setSelectedDocs((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleUpdate = () => {
    const token = localStorage.getItem('token');
    axios.put(
      `http://localhost:5000/api/admin/ilanlar/${id}`,
      {
        baslik: editedTitle,
        aciklama: editedDescription,
        baslangic_tarihi: editedStartDate,
        bitis_tarihi: editedEndDate,
        requiredDocuments: selectedDocs,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        setAdvert((prev) => ({
          ...prev,
          baslik: editedTitle,
          aciklama: editedDescription,
          baslangic_tarihi: editedStartDate,
          bitis_tarihi: editedEndDate,
        }));
        setRequiredDocs(allDocTypes.filter((doc) => selectedDocs.includes(doc.id)));
        alert('İlan başarıyla güncellendi!');
        setEditMode(false);
      })
      .catch((error) => {
        console.error('İlan güncellenirken hata:', error.response?.data || error.message);
        alert('İlan güncellenirken bir hata oluştu.');
      });
  };

  const handleDelete = () => {
    if (window.confirm('İlanı silmek istediğinizden emin misiniz?')) {
      const token = localStorage.getItem('token');
      axios.delete(`http://localhost:5000/api/admin/ilanlar/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => {
          alert('İlan başarıyla silindi!');
          navigate(-1);
        })
        .catch((error) => {
          console.error('İlan silinirken hata:', error.response?.data || error.message);
          alert('İlan silinirken hata oluştu.');
        });
    }
  };

  return (
    <div className="mainDiv">
      <div className="topDiv">
        <div className="topMain">
          <div className="kouName">Kocaeli Üniversitesi</div>
          <div className="topMainIn">
            {/* Sol Container: Belgeler */}
            <div className="topMainInRow1">
              <h3>Gerekli Belgeler</h3>
              {editMode ? (
                <div className="doc-selection">
                  {allDocTypes.map((doc) => (
                    <div key={doc.id}>
                      <input
                        type="checkbox"
                        checked={selectedDocs.includes(doc.id)}
                        onChange={() => handleDocSelection(doc.id)}
                      />
                      <label>{doc.tur}</label>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="doc-list">
                  {requiredDocs.length > 0 ? (
                    requiredDocs.map((doc) => (
                      <li key={doc.id}>
                        <span className="doc-icon">📄</span>
                        <span className="doc-name">{doc.tur}</span>
                      </li>
                    ))
                  ) : (
                    <li>Gerekli belge bulunmamaktadır.</li>
                  )}
                </ul>
              )}
            </div>

            {/* Orta Container: İlan Bilgileri */}
            <div className="topMainInRow2">
              {advert ? (
                <div>
                  {editMode ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        placeholder="İlan Başlığı"
                      />
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        rows="4"
                        placeholder="İlan Açıklaması"
                      />
                      <label>Başlangıç Tarihi: </label>
                      <input
                        type="date"
                        value={editedStartDate}
                        onChange={(e) => setEditedStartDate(e.target.value)}
                      />
                      <label>Bitiş Tarihi: </label>
                      <input
                        type="date"
                        value={editedEndDate}
                        onChange={(e) => setEditedEndDate(e.target.value)}
                      />
                      <div className="form-buttons">
                        <button onClick={handleUpdate}>Kaydet</button>
                        <button onClick={() => setEditMode(false)} className="cancel-button">
                          İptal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h1>{advert.baslik}</h1>
                      <h4>{advert.baslangic_tarihi} - {advert.bitis_tarihi}</h4>
                      <br />
                      <p>{advert.aciklama}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p>İlan içeriği yükleniyor...</p>
              )}
            </div>

            {/* Sağ Container: Butonlar */}
            <div className="topMainInRow3">
              {!editMode && (
                <>
                  <button onClick={toggleEditMode}>İlanı Güncelle</button>
                  <br />
                  <div className="deleteAdvertDiv">
                    <button onClick={handleDelete} className="delete-button">🗑</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alt Kısım: Başvuranlar */}
      <div className="bottomDiv">
        <div className="bottomDivLeft">
          <div className="kouName">Kocaeli Üniversitesi</div>
          <h2>Puanlanan Faaliyet Dönemi</h2>
          <div>
            <h3><input type="checkbox" /> A. Makaleler</h3>
            <h3><input type="checkbox" /> B. Bilimsel Toplantı Faaliyetleri</h3>
            <h3><input type="checkbox" /> C. Kitaplar</h3>
          </div>
        </div>
        <div className="bottomDivRight">
          <h2>Başvuru Yapanlar</h2>
          <ul>
            {currentApplicants.map((applicant) => (
              <li key={applicant.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span>
                  {applicant.name} {applicant.durum && `- ${applicant.durum}`}
                </span>
                {evaluatingApplicantId === applicant.id ? (
                  <>
                    <button onClick={() => updateApplicantStatus(applicant.id, 'Onaylandı')}>Onayla</button>
                    <button onClick={() => updateApplicantStatus(applicant.id, 'Reddedildi')}>Reddet</button>
                    <button onClick={() => setEvaluatingApplicantId(null)}>Vazgeç</button>
                  </>
                ) : (
                  <button onClick={() => handleDeğerlendir(applicant.id)}>Değerlendir</button>
                )}
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button onClick={handlePrevPage} disabled={currentPage === 1}>Önceki</button>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>Sonraki</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Admin_advert_content;
