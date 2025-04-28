import React from 'react';
import { Link } from "react-router-dom";
import icon from '../assets/icon.png';
import "../pages/css/header.css";

function Header() {
  return (
    <div className='header'>
      <div className='header-left'>
        <Link to="/">
          <img src={icon} alt="logo" className='logo'/>
        </Link>
   
      </div>
      <div className='header-right'>
        <Link className='login-btn' to="/login">Giriş →</Link>
      </div>
    </div>
  )
}

export default Header;
