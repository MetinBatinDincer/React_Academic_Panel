import React from 'react';
import { Link } from "react-router-dom";
import universityPhoto from '../assets/university_photo.png';
import logo from '../assets/icon.png';
import "../pages/css/footer.css";

function Footer() {
  return (
    <div className='footer-container'>
      <div className='footer-image'>
        <img src={universityPhoto} alt="University" className='university-photo'/>
        <img src={logo} alt="Logo" className='logo-footer'/>
      </div>

      <div className='footer-content'>
        <div className='footer-column'>
          <h3>Fakülteler</h3>
          <Link to="/login">Dersanlik Fakültesi</Link>
          <Link to="/login">Diş Hekimliği Fakültesi</Link>
          <Link to="/login">Eğitim Fakültesi</Link>
          <Link to="/login">Akademik</Link>
          <Link to="/login">Akademik</Link>
          <Link to="/login">Akademik</Link>
        </div>

        <div className='footer-column'>
          <h3>Enstitüler</h3>
          <Link to="/login">Denizcilik Fakültesi</Link>
          <Link to="/login">Diş Hekimliği Enstitüsü</Link>
          <Link to="/login">Eğitim Enstitüsü</Link>
          <Link to="/login">Akademik</Link>
        </div>

        <div className='footer-column'>
          <h3>Konservatuvar</h3>
          <Link to="/login">Konservatuvar Fakültesi</Link>
          <h3>Yüksekokullar</h3>
          <Link to="/login">Eğitim Fakültesi</Link>
          <Link to="/login">Akademik</Link>
        </div>
      </div>
    </div>
  )
}

export default Footer;
