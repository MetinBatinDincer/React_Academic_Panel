import React, { useState } from 'react';
import axios from 'axios';
import './css/applicant_login.css';

function RegisterForm() {
  const [formData, setFormData] = useState({
    tc: '',
    ad: '',
    soyad: '',
    dogumYili: '',
    email: '',
    sifre: ''
  });
  const [message, setMessage] = useState('');

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
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Bir hata oluştu');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="form-title">
          <span className="line"></span>
          <h2>Kayıt Formu</h2>
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
            type="text"
            name="ad"
            value={formData.ad}
            onChange={handleChange}
            required
            placeholder="Ad"
          />
          <input
            type="text"
            name="soyad"
            value={formData.soyad}
            onChange={handleChange}
            required
            placeholder="Soyad"
          />
          <input
            type="number"
            name="dogumYili"
            value={formData.dogumYili}
            onChange={handleChange}
            required
            placeholder="Doğum Yılı"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email"
          />
          <input
            type="password"
            name="sifre"
            value={formData.sifre}
            onChange={handleChange}
            required
            placeholder="Şifre"
          />
          <button type="submit">Kayıt Ol</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default RegisterForm;
