import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './css/applicant_first_login.css';

function AdminLogin() {
  const [formData, setFormData] = useState({
    tc: '',
    sifre: ''
  });
  const [message, setMessage] = useState('');
  const [authToken, setAuthToken] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend API endpoint'ine POST isteği gönderiyoruz.
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const token = response.data.token;
      
      // Token'ı decode edip rol kontrolü yapıyoruz
      try {
        if (token) {
          const decoded = jwtDecode(token);
          const { id, tc, rol, iat, exp } = decoded;
          console.log("id:", id, "tc:", tc, "rol:", rol);
          
          // Sadece admin rolü olan kullanıcılar giriş yapabilir
          if (rol !== 'admin') {
            setMessage('Bu sayfa sadece admin kullanıcıları için erişilebilir.');
            return;
          }
          
          // Admin rolü doğrulandı, token'ı kaydediyoruz
          localStorage.setItem('token', token);
          setAuthToken(token);
          
          console.log("Token = ", token);
          setMessage(response.data.message || 'Giriş başarılı');
          // Admin ana sayfasına yönlendirme
          navigate('/Admin_home');
        } else {
          setMessage('Token alınamadı.');
        }
      } catch (err) {
        console.error("Token decode edilirken hata oluştu:", err);
        setMessage('Kimlik doğrulama hatası');
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="form-title">
          <span className="line"></span>
          <h2>Admin Giriş</h2>
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
          <button type="submit">Admin Girişi</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default AdminLogin;
