import React from 'react'
import { useNavigate } from 'react-router-dom'
import  expImage7 from '../../assets/images/expert7.jpeg';
import { FaLocationDot } from "react-icons/fa6";
const SingleExpert = ({expert, userId}) => {
    const {id, username, phone_number, location, first_name, last_name, description, img} = expert
    const navigate = useNavigate();

    const desc= description || "She is a Poultry Expert with over 10 years of experience in the field. She has worked with various organizations in Kenya and Uganda. She is a consultant for the World Bank and the United Nations. She has a PhD in Agriculture from the University of Nairobi"

  return (
    <div className=' shadow'>
    <div className='relative'>


    </div>
    <div className='w-80 mx-auto'>
    <div className='flex justify-between items-center'> 
    <div>
    <h1 className='my-3 font-semibold '>Dr.{username} <br/> <div className='flex items-center'><FaLocationDot className=''/> <small>{location}</small></div> </h1>
   
    </div>
    <button className=' hover:border-0 border border-black text-black hover:text-white hover:bg-black text-sm  px-2  h-8 font-semibold rounded transition duration-100' onClick={()=>{
        navigate(`/farmers/Consultations/messages/${userId}_${id}/`)

    }}>
        Consult
    </button>

    </div>
       
        </div>
    </div>
  )
}

export default SingleExpert