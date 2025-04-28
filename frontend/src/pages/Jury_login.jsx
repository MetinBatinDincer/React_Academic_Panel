import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Link kaldırıldı
import { jwtDecode } from 'jwt-decode';
import './css/jury_login.css';

function JuryLogin() {
  const [formData, setFormData] = useState({ tc: '', sifre: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const token = response.data.token;

      if (!token) {
        setMessage('Token alınamadı, lütfen tekrar deneyin.');
        return;
      }

      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      console.log('Decoded token:', decoded);

      if (decoded.rol === 'juri') {
        setMessage('Giriş başarılı!');
        navigate('/Jury_Menu');
      } else {
        setMessage("Sadece 'jury' rolündeki kullanıcılar giriş yapabilir.");
      }
    } catch (error) {
      console.error('Hata:', error);
      setMessage(error.response?.data?.error || 'Bir hata oluştu');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="form-title">
          <span className="line"></span>
          <h2>Jüri Girişi</h2>
          <span className="line"></span>
        </div>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="tc"
            placeholder="TC Kimlik No"
            value={formData.tc}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="sifre"
            placeholder="Şifre"
            value={formData.sifre}
            onChange={handleChange}
            required
          />
          <button type="submit">Giriş Yap</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default JuryLogin;