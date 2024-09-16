// import React from 'react'
// import { Routes, Route } from "react-router-dom";
// import './PagesLayout.css'
// import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill} from 'react-icons/bs'
// // import MergeLayouts from '../MergeBuyersLayouts/MergeBuyersLayouts';
// import CropInfo from '../../ExpertsPages/CropInfo/CropInfo';
// import MarketProducts from '../../ExpertsPages/MarketProducts/MarketProducts'
// import Forum from '../../ExpertsPages/Forum/Forum'
// import Consultations from '../../ExpertsPages/Consultations/Consultations'
// import Reports from '../../ExpertsPages/Reports/Reports';
// import Profile from '../../ExpertsPages/Profile/Profile'

// const PagesLayout = () => {

//   return (
//     <main className='home-main-container'>
//       <Routes>
//         {/* <Route path='/' element={<CropInfo />}/> */}
//         <Route path='/CropInfo' element={<CropInfo/>}/>
//         <Route path='/MarketProducts' element={<MarketProducts />}/>
//         {/* <Route path='/OrderProducts' element={<OrderProducts />}/> */}
//         <Route path='/Forum' element={<Forum />}/>
//         <Route path='/Consultations' element={<Consultations />}/>
//         <Route path='/Reports' element={<Reports />}/>
//         <Route path='/Profile' element={<Profile />}/>
//       </Routes>
//     </main>
//   )
// }

// export default PagesLayout




import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './PagesLayout.css';
import CropInfo from '../../ExpertsPages/CropInfo/CropInfo';
import MarketProducts from '../../ExpertsPages/MarketProducts/MarketProducts'
import Forum from '../../../Farmers-components/FarmersPages/Forum/Forum-components/Page'
import Consultations from '../../ExpertsPages/Consultations/Consultation-component/PageRouter'
import Reports from '../../ExpertsPages/Reports/Reports';
import Profile from '../../ExpertsPages/Profile/Profile';

const PagesLayout = ({ token, userId }) => {
  return (
    <main className='home-main-container'>
      <Routes>
        <Route path='/CropInfo' element={<CropInfo token={token} userId={userId} />} />
        <Route path='/MarketProducts' element={<MarketProducts token={token} userId={userId} />} />
        <Route path='/Forum' element={<Forum token={token} userId={userId} />} />
        <Route path='/Consultations/messages/*' element={<Consultations token={token} userId={userId} />} />
        <Route path='/Reports' element={<Reports token={token} userId={userId} />} />
        <Route path='/Profile' element={<Profile token={token} userId={userId} />} />
      </Routes>
    </main>
  );
};

export default PagesLayout;
