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
  const [authToken, setAuthToken] = useState(''); // Token'ı burada tutuyoruz.
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
      
      // Token'ı hem localStorage'a hem de state'e kaydediyoruz.
      localStorage.setItem('token', token);
      setAuthToken(token);
      
      try {
        if (token) {
          const decoded = jwtDecode(token);
          const { id, tc, rol, iat, exp } = decoded;
          console.log("id:", id, "tc:", tc, "rol:", rol);
        } else {
          console.log("Token alınamadı.");
        }
      } catch (err) {
        console.error("Token decode edilirken hata oluştu:", err);
      }
      
      console.log("Token = ", token);
      setMessage(response.data.message);
      // Örneğin profil sayfasına yönlendirme
      navigate('/Admin_home');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Bir hata oluştu');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="form-title">
          <span className="line"></span>
          <h2>Hoşgeldiniz</h2>
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
          <Link to="/applicant_login" className="link-style">Kayıt Ol</Link>

          <Link to="/Admin_home" className="link-style">Admin Home Geçici Link</Link>

          <button type="submit">Giriş Yap</button>




         
         
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default AdminLogin;
