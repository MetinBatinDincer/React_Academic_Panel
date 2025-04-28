import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Deneme() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Token'ı localStorage'dan alıyoruz
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token bulunamadı.');
      return;
    }

    axios.get('http://localhost:5000/api/users/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setUserData(response.data);
    })
    .catch(err => {
      console.error("API hatası:", err.response);
      setError(err.response?.data?.error || 'Kullanıcı bilgileri alınamadı');
    });
  }, []);

  if (error) return <div>{error}</div>;
  if (!userData) return <div>Yükleniyor...</div>;

  return (
    <div>
      <h2>Kullanıcı Profili</h2>
      <p>ID: {userData.id}</p>
      <p>TC: {userData.tc}</p>
      <p>Ad: {userData.ad}</p>
      <p>Soyad: {userData.soyad}</p>
      <p>Email: {userData.email}</p>
      <p>Rol: {userData.rol}</p>
      <p>Doğum Yılı: {userData.dogumYili}</p>
    </div>
  );
}

export default Deneme;
