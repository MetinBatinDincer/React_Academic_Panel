import React, { useEffect, useState } from 'react'
import ContainerHome from '../Components/ContainerHome'
import Footer from '../Components/footer'
import axios from 'axios'
import './css/home.css'

function Home() {
  const [ilanlar, setIlanlar] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/api/ilanlar')
      .then(res => setIlanlar(res.data.ilanlar))
      .catch(err => console.error('İlanlar çekilemedi:', err))
  }, [])

  return (
    <div>
      <div className='homeDiv'>
        <div className='homePictures' />
        <div className='pictureDescriptionHome' />
      </div>

      <div className='lastAddHome'>
        <p className='lastAddPHome'>Akademik İlanlar</p>
        <div className='lastAddHomeGrid'>
          {ilanlar.map(ilan => (
          <ContainerHome
           key={ilan.id}
            title={ilan.baslik}
           date={ilan.baslangic_tarihi}
           description={ilan.aciklama}
    />
  ))}
</div>

      </div>

      <Footer/>
    </div>
  )
}

export default Home
