import React from 'react';
import './css/login.css';
import Footer from '../Components/footer';
import { Link } from "react-router-dom"; 


function LogIn() {

  return (
    <div className="container">

<br /><br /><br />
      <h1>Kocaeli Üniversitesi Giriş Sistemi</h1>

      <br /><br /><br /><br />

      <div className="mainSection">
        <h3>Üniversite Giriş Sistemi</h3>
        <div className="buttonGroup">
          <Link className="button-link" to="/">Öğrenci Girişi</Link>
          <Link className="button-link" to="/manager_login">Yönetici Girişi</Link>
          <Link className="button-link" to="/applicant_first_login">Aday Girişi</Link>
          <Link className="button-link" to="/JuryLogin">Jüri Girişi</Link>
          <Link className="button-link" to="/Admin_login">Admin Girişi</Link>
        </div>

        <h3>Eğitim Yönetim Bilgi Sistemleri</h3>
        <div className="buttonGroup">
          <Link className="button-link" to="/">EYYK</Link>
          <Link className="button-link" to="/">AKTS</Link>
          <Link className="button-link" to="/">UZEM</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LogIn;
