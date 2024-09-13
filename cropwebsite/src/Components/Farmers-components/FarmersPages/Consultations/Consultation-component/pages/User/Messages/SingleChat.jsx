import React from 'react'
import { Link } from 'react-router-dom'
import  expImage7 from '../../../assets/images/expert7.jpeg';
import { useMainContext } from '../../../../../../../../ context'
import { FaRegUserCircle } from "react-icons/fa";
const SingleChat = ({expert}) => {
   
    if(!expert){
        return null;
    }
    const {userData, token} = useMainContext()

  return (
    <Link to={`/farmers/Consultations/messages/${userData.id}_${expert.id}/`}>
    <div className='flex items-center my-3 bg-green-200 shadow rounded p-4'>

                    <div className='ml-3 flex items-center'>
                    <FaRegUserCircle className='text-2xl'/>
                    <h1 className='font-semibold text-lg pl-2'>Dr.{expert.username}</h1>

                    </div>
    </div>
    </Link>
  )
}

export default SingleChat