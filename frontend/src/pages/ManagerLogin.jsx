import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function ManagerLoginPage() {
  const [formData, setFormData] = useState({ tc: '', sifre: '' });
  const [message, setMessage] = useState('');
  const [authToken, setAuthToken] = useState('');
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
      setAuthToken(token);
      setMessage(response.data.message);

      const decoded = jwtDecode(token);
      const { rol } = decoded;
      console.log("decoded rol:", rol);

      if (rol === 'yonetici') {
        navigate('/manager_home');
      } else {
        setMessage("Bu ekrandan sadece 'yonetici' rolündeki kullanıcılar giriş yapabilir!");
      }

    } catch (error) {
      setMessage(error.response?.data?.error || 'Bir hata oluştu');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="form-title">
          <span className="line"></span>
          <h2>Yönetici Girişi</h2>
          <span className="line"></span>
        </div>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="tc"
            value={formData.tc}
            onChange={handleChange}
            required
            placeholder="TC Kimlik No"
          />
          <input
            type="password"
            name="sifre"
            value={formData.sifre}
            onChange={handleChange}
            required
            placeholder="Şifre"
          />
          <Link to="/" className="link-style">Ana Sayfaya Dön</Link>
          <button type="submit">Giriş Yap</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default ManagerLoginPage;
