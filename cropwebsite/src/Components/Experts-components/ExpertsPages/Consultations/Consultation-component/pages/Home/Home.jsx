import React from 'react'
import HoverRound from '../../components/HoverRound';
import { LuMessagesSquare } from "react-icons/lu";
import SingleExpert from './SingleExpert';
import experts from './experts';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className=' '>
    <div className='p-3 shadow sticky  top-0 z-50 w-full bg-green-800 text-white '>
    <div className=' flex justify-between w-80  font-bold'>
      <h1 className='text-lg  my-auto'>Consultation</h1>
      <HoverRound variant={"round1"}>
      <LuMessagesSquare className='text-2xl'  onClick={()=>{
        console.log("clicked")
        navigate('/consultation/farmers/messages')
      }} />
      </HoverRound>

    </div>
    </div>
    <div className='my-5 space-y-5 '>
      {
        experts.map((expert)=>{
          return (
            <SingleExpert expert={expert} />
          )
        })
      }
    </div>
    
    </div>
  )
}

export default Home