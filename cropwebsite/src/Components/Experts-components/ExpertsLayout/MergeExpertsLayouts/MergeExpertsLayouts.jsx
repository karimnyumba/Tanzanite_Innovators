// // import { useState } from 'react'
// // import './MergeExpertsLayouts.css'
// // import HeaderLayout from '../HeaderLayout/HeaderLayout'
// // import SideBarLayout from '../SideBarLayout/SideBarLayout'
// // import PagesLayout from '../PagesLayout/PagesLayout'

// // const MergeExpertsLayouts = () => {
// //     const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

// //     const OpenSidebar = () => {
// //       setOpenSidebarToggle(!openSidebarToggle);
// //     }
// //   return (
// //     <>
// //         <div className='grid-container'>
// //             <HeaderLayout OpenSidebar={OpenSidebar}/>
// //             <SideBarLayout openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
// //             <PagesLayout/>    
// //         </div>    
// //     </>
// //   )
// // }

// // export default MergeExpertsLayouts



// import { useState } from 'react';
// import './MergeExpertsLayouts.css';
// import HeaderLayout from '../HeaderLayout/HeaderLayout';
// import SideBarLayout from '../SideBarLayout/SideBarLayout';
// import PagesLayout from '../PagesLayout/PagesLayout';

// const MergeExpertsLayouts = ({ token, userId }) => {
//   const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

//   const OpenSidebar = () => {
//     setOpenSidebarToggle(!openSidebarToggle);
//   };

//   return (
//     <div className="grid-container">
//       <HeaderLayout OpenSidebar={OpenSidebar} />
//       <SideBarLayout openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
//       <PagesLayout token={token} userId={userId} />
//     </div>
//   );
// };

// export default MergeExpertsLayouts;



import React, { useState } from 'react';
import './MergeExpertsLayouts.css';
import HeaderLayout from '../HeaderLayout/HeaderLayout';
import SideBarLayout from '../SideBarLayout/SideBarLayout';
import PagesLayout from '../PagesLayout/PagesLayout';

const MergeExpertsLayouts = ({ token, userId }) => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className='grid-container'>
      <HeaderLayout OpenSidebar={OpenSidebar} />
      <SideBarLayout openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <PagesLayout token={token} userId={userId} />
    </div>
  );
};

export default MergeExpertsLayouts;
