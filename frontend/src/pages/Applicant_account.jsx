import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../Components/footer';
import './css/Applicant_account.css';

function Applicant_account() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedEmail, setEditedEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setProfile(response.data);
          setEditedEmail(response.data.email); // Başlangıç değeri
        })
        .catch((error) => console.error("Profil verisi çekilemedi:", error));
    }
  }, []);

  const handleEdit = () => {
    setEditedEmail(profile.email);
    setEditMode(true);
  };

  const handleSave = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .put(
        'http://localhost:5000/api/users/profile',
        { email: editedEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        // Backend'den gelen veriyi kullanmadan, mevcut profile değerlerini koruyarak sadece email'i güncelliyoruz.
        setProfile(prev => ({ ...prev, email: editedEmail }));
        setEditMode(false);
        alert("Profil başarıyla güncellendi!");
      })
      .catch((err) => {
        console.error("Profil güncelleme hatası:", err);
        alert("Profil güncelleme sırasında hata oluştu.");
      });
  };

  const handleCancel = () => {
    setEditedEmail(profile.email);
    setEditMode(false);
  };

  return (
    <div>
      {/* Üst Kısım */}
      <div className="jury-container">
        <div className="jury-container1">
          <div className="title-line">
            <h4>Kocaeli Üniversitesi Bilgi Merkezi</h4>
            <br /><br /><br /><br />
            <span className="line"></span>
          </div>
          <div className="jury-container1-in">
            <div className="jury-container-content">
              <span className="spanName">
                <p>Sayın {profile?.ad} {profile?.soyad}</p>
              </span>
              <p>Kocaeli Üniversitesi</p>
              <p>Akademik Personel</p>
              <p>Başvuru Sistemine</p>
              <p>Hoşgeldiniz</p>
            </div>
          </div>
        </div>
      </div>
      <br /><br /><br />

      {/* Alt Kısım - Genel Kişisel Bilgiler */}
      <div className="bottomDivApplicant">
        <div className="title-line">
          <h4>Kocaeli Üniversitesi</h4>
          <span className="line"></span>
        </div>
        <h2>Genel Kişisel Bilgiler</h2>

        {/* Kişisel Bilgiler Kartı */}
        <div className="personal-info-card">
          <div className="personal-info-left">
            <p>Adı Soyadı (Ünvanı) : {profile?.ad} {profile?.soyad}</p>
            <p>Doğum Tarihi : {profile?.dogumYili}</p>
            <p>Rol : {profile?.rol}</p>
            <p>TC : {profile?.tc}</p>
            {editMode ? (
              <>
                <label>Email:</label>
                <input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                />
              </>
            ) : (
              <p>Email : {profile?.email}</p>
            )}
          </div>
          <div className="personal-info-right">
            {editMode ? (
              <>
                <button className="save-btn" onClick={handleSave}>Kaydet</button>
                <button className="cancel-btn" onClick={handleCancel}>İptal</button>
              </>
            ) : (
              <button className="update-btn" onClick={handleEdit}>Güncelle</button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Applicant_account;
