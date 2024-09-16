import { useState } from 'react'
import './MergeBuyersLayouts.css'
import HeaderLayout from '../HeaderLayout/HeaderLayout'
import SideBarLayout from '../SideBarLayout/SideBarLayout'
import PagesLayout from '../PagesLayout/PagesLayout'

const MergeBuyersLayouts = () => {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

    const OpenSidebar = () => {
      setOpenSidebarToggle(!openSidebarToggle);
    }
  return (
    <>
        <div className='grid-container'>
            <HeaderLayout OpenSidebar={OpenSidebar}/>
            <SideBarLayout openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
            <PagesLayout/>    
        </div>    
    </>
  )
}

export default MergeBuyersLayouts