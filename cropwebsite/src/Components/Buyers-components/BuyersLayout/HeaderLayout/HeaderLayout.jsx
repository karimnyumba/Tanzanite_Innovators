import React from 'react'
import './HeaderLayout.css'
import {BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify} from 'react-icons/bs'
import { Link } from 'react-router-dom';

const HeaderLayout = ({OpenSidebar}) => {
  return (
       <header className='header'>
        <div className='menu-icon'>
            <BsJustify className='icon' onClick={OpenSidebar}/>
        </div>
        <div className='header-left'>
            <BsSearch  className='icon'/>
        </div>
        <div className='header-right'>
            <BsFillBellFill className='icon-header'/>
            <BsFillEnvelopeFill className='icon-header'/>
            <Link to='/buyers/Profile'><BsPersonCircle className='icon-header'/></Link>
        </div>
    </header>
  )
}

export default HeaderLayout