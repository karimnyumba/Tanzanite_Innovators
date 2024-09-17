import React from 'react'
import { Link } from 'react-router-dom'
import expImage7 from '../../../assets/images/expert7.jpeg';
import { FaRegUserCircle } from "react-icons/fa";
const SingleChat = ({user, expert_id, id}) => {
console.log(id)
    if(!user){
        return null;
    }

  return (
    <Link to={`/experts/Consultations/messages/${id}/`}>
    <div className='flex items-center my-3 bg-green-200 shadow rounded p-4'>

                    <div className='ml-3 flex items-center'>
                    <FaRegUserCircle className='text-2xl'/>
                    <h1 className='font-semibold text-lg pl-2'>{user.username}</h1>

                    </div>
    </div>
    </Link>
  )
}

export default SingleChat