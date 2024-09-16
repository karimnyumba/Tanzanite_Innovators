import React from 'react'
import { Routes, Route } from "react-router-dom";
import './PagesLayout.css'
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill} from 'react-icons/bs'
// import MergeLayouts from '../MergeBuyersLayouts/MergeBuyersLayouts';
import CropInfo from '../../BuyersPages/CropInfo/CropInfo';
import MarketProducts from '../../BuyersPages/MarketProducts/MarketProducts'
import OrderProducts from '../../BuyersPages/OrderProducts/OrderProducts'
import Forum from '../../BuyersPages/Forum/Forum'
import Consultations from '../../BuyersPages/Consultations/Consultations'
import Reports from '../../BuyersPages/Reports/Reports';
import Profile from '../../BuyersPages/Profile/Profile'

const PagesLayout = () => {

  return (
    <main className='home-main-container'>
      <Routes>
        {/* <Route path='/' element={<CropInfo />}/> */}
        <Route path='/CropInfo' element={<CropInfo/>}/>
        <Route path='/MarketProducts' element={<MarketProducts />}/>
        <Route path='/OrderProducts' element={<OrderProducts />}/>
        <Route path='/Forum' element={<Forum />}/>
        <Route path='/Consultations' element={<Consultations />}/>
        <Route path='/Reports' element={<Reports />}/>
        <Route path='/Profile' element={<Profile />}/>
      </Routes>
    </main>
  )
}

export default PagesLayout