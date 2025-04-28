import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function ApplicantFirstLogin() {
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
      // Backend API endpoint'ine POST isteği gönderiyoruz.
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const token = response.data.token;

      if (!token) {
        setMessage('Token alınamadı, lütfen tekrar deneyin.');
        return;
      }

      // Token'ı localStorage'a ve state'e kaydediyoruz.
      localStorage.setItem('token', token);
      setAuthToken(token);
      setMessage(response.data.message);

      console.log("Token = ", token);

      // Token decode edip rol kontrolü yapalım
      try {
        const decoded = jwtDecode(token);
        const { rol } = decoded;
        console.log("decoded rol:", rol);

        // Eğer rol 'aday' ise home'a yönlendir
        if (rol === 'aday') {
          navigate('/Applicant_home');
        } else {
          // Aday değilse sadece uyarı ver, token'ı SİLME.
          setMessage("Sadece 'aday' rolündeki kullanıcılar bu ekrandan giriş yapabilir!");
        }
      } catch (err) {
        console.error("Token decode edilirken hata oluştu:", err);
        setMessage("Token decode edilemedi.");
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
          <button type="submit">Giriş Yap</button>
          <Link to="/Candidate_application_details" className="link-style"> candidate_application datay</Link>

         
    
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default ApplicantFirstLogin;