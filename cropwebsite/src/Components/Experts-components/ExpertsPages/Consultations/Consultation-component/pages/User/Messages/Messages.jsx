import React from 'react'
import BackBtn from '../../../components/BackBtn'
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoSearchSharp } from "react-icons/io5";
import experts from './experts';
import SingleExpert from '../../Home/SingleExpert';
import SingleChat from './SingleChat';
const Messages = () => {
  return (
    <>
    <BackBtn />
    <div className=''>
    <div className='sticky top-0 z-0 pt-4 pl-14 pb-2  flex items-center w-full shadow '>
    <h1 className=' font-semibold text-lg'>Daniel</h1>
    <RiArrowDropDownLine className='text-2xl' />
    </div>
    <div className=' overflow-y-scroll mx-3 mt-3'>
        <form className=' relative '>
        <IoSearchSharp className='absolute top-3 left-3 text-2xl opacity-85 text-gray-600' />
            <input type="text" placeholder='Search' className='border-2 border-green-800 p-2 rounded-lg w-full pl-10' />
        </form>
        
        <div>
        <div className='pl-2 font-semibold mt-3'>Messages</div>

        {
            experts.map((expert)=>{
                return (
                   <SingleChat expert={expert} key={expert.id} />
                )
            })
        }

        </div>
</div>
    </div>
    
        
    </>

  )
}

export default Messages