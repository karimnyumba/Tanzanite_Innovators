import React from 'react'
import { Link } from 'react-router-dom'
const SingleChat = ({expert}) => {
    const userId = "999";
    if(!expert){
        return null;
    }

  return (
    <Link to={`/consultation/farmers/messages/${userId}_${expert.id}/`}>
    <div className='flex items-center my-3'>
                    <img src={expert.img} alt={expert.name} className='rounded-full w-14 h-14' />
                    <div className='ml-3'>
                    <h1 className='font-semibold'>{expert.name}</h1>

                    </div>
    </div>
    </Link>
  )
}

export default SingleChat