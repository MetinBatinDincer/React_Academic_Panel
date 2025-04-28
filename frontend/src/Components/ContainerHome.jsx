import React from 'react';
import './ContainerHome.css';

export default function ContainerHome({ title, date, description }) {
  return (
    <div className="container-home">
      <p className="date">{date}</p>
      <h3 className="title">{title}</h3>
      <p className="description">{description}</p>
    </div>
  );
}
