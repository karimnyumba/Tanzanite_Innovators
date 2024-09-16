import React from 'react'
import { useNavigate } from 'react-router-dom'

const SingleExpert = ({expert}) => {
    const {name, img, description, education, title, location} = expert
    const navigate = useNavigate();
    const userId = "999";
  return (
    <div className=''>
    <div className='relative'>
    <img src={img} alt={name} className='mx-auto rounded w-80' />
    <div className='absolute bottom-2 left-2 bg-green-800 p-1 text-white rounded'>{title}</div>
    </div>
    <div className='w-80 mx-auto'>
    <div className='flex justify-between items-center'> 
    <h1 className='my-3 font-semibold '>{name}</h1>
    <button className=' hover:border-0 border border-black text-black hover:text-white hover:bg-black text-sm  px-2  h-8 font-semibold rounded transition duration-100' onClick={()=>{
        navigate(`/consultation/farmers/messages/${userId}_${expert.id}/`)

    }}>
        Consult
    </button>

    </div>
        <div>
            <p className='text-sm font-light opacity-75'>{description}</p>
     
        </div>
        </div>
    </div>
  )
}

export default SingleExpert