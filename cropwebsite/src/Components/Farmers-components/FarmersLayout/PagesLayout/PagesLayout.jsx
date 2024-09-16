import React from 'react'
import { Routes, Route } from "react-router-dom";
import './PagesLayout.css'
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill} from 'react-icons/bs'
import MergeLayouts from '../MergeFarmersLayouts/MergeFarmersLayouts';
import CropInfo from '../../FarmersPages/CropInfo/CropInfo';
import MarketProducts from '../../FarmersPages/MarketProducts/MarketProducts'
import Orders from '../../FarmersPages/Orders/Orders'
import Forum from '../../FarmersPages/Forum/Forum-components/Page'
import Consultations from '../../FarmersPages/Consultations/Consultation-component/PageRouter'
import Reports from '../../FarmersPages/Reports/Reports';
import Profile from '../../FarmersPages/Profile/Profile'

const PagesLayout = () => {

  return (
    <main className='home-main-container'>
      <Routes>
        {/* <Route path='/' element={<CropInfo />}/> */}
        <Route path='/CropInfo' element={<CropInfo/>}/>
        <Route path='/MarketProducts' element={<MarketProducts />}/>
        <Route path='/Orders' element={<Orders />}/>
        <Route path='/Forum' element={<Forum />}/>
        <Route path='/Consultations/*' element={<Consultations />}/>
        <Route path='/Reports' element={<Reports />}/>
        <Route path='/Profile' element={<Profile />}/>
      </Routes>
    </main>
  )
}

export default PagesLayout