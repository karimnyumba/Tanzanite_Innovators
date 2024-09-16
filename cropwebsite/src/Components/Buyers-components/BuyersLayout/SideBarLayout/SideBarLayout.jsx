import React, { useEffect } from 'react'
import './SideBarLayout.css'
import { BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill } from 'react-icons/bs'
import {LuFlower2} from 'react-icons/lu'
import { SlLogout } from "react-icons/sl";
import { GiButterflyFlower } from "react-icons/gi";
import { MdOutlineForum, MdDashboard, MdOutlineProductionQuantityLimits } from "react-icons/md";
import { GrArticle } from "react-icons/gr";
import { Link } from 'react-router-dom';

const SideBarLayout = ({ openSidebarToggle, OpenSidebar }) => {

  return (
   <aside id='sidebarlayout' className={openSidebarToggle ? "sidebarlayout-responsive" : ""}>
      <div className="sidebarlayout-title">
        <div className="sidebarlayout-brand">
          <Link to='/'><h3 className='side-logo'>Kilimo Kipy</h3></Link>
        </div>
        <span className='side_icon side_close_icon' onClick={OpenSidebar}>X</span>
      </div>

      <ul className='sidebarlayout-list'>

        <li className='sidebarlayout-list-item'>
          <Link to='/buyers/CropInfo'><GiButterflyFlower className='icon'/> Crops Information</Link>
        </li>

        <li className='sidebarlayout-list-item'>
          <Link to='/buyers/MarketProducts'><MdOutlineProductionQuantityLimits className='icon'/> Markert Products</Link>
        </li>

        <li className='sidebarlayout-list-item'>
          <Link to='/buyers/OrderProducts'><BsListCheck className='icon'/> Orders Products</Link>
        </li>

        <li className='sidebarlayout-list-item'>
          <Link to='/buyers/Forum'><MdOutlineForum className='icon'/> Forum Discussions</Link>
        </li>
        
        <li className='sidebarlayout-list-item'>
          <Link to='/buyers/Consultations'> <GrArticle className='icon'/> Consultations</Link>
        </li>

        <li className='sidebarlayout-list-item'>
          <Link to='/buyers/Reports'><MdDashboard className='icon'/> Reports</Link>
        </li>
        <li className='sidebarlayout-list-item'>
          <Link to='/logout'><SlLogout className='icon'/> Logout</Link>
        </li>
      </ul>
   </aside>
  )
}

export default SideBarLayout