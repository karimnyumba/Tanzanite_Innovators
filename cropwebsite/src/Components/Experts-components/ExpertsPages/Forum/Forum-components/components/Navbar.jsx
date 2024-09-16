import React , {useState}from 'react'
import { IoIosCreate } from "react-icons/io";

import CreatePost from './CreatePost';
const Navbar = () => {
    const [openModal, setOpenModal] = useState(false)
  return (
    <>
    <div className='px-5 p-3 w-full bg-green-700 shadow flex justify-between text-opacity-80'>
        <h1 className='text-white font-semibold text-lg shadow lg:text-3xl '>Discussion Forum</h1>
      <div className='flex items-center cursor-pointer' onClick={()=>setOpenModal(!openModal)}>
        
        <IoIosCreate className='text-white text-2xl'/>
        <small className='align-center text-white'>Create post</small>
        </div>
    </div>
    {openModal && <CreatePost setOpenModal={setOpenModal} />}
    </>
   
  )
}

export default Navbar