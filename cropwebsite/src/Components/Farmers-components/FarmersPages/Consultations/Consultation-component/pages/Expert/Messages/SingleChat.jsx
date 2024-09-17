import React from 'react'
import { Link } from 'react-router-dom'
const SingleChat = ({user}) => {
    const expert = "435";
    if(!user){
        return null;
    }

  return (
    <Link to={`/consultation/experts/messages/${user.id}_${expert}/`}>
    <div className='flex items-center my-3'>
                    <img src={user.img} alt={user.name} className='rounded-full w-14 h-14' />
                    <div className='ml-3'>
                    <h1 className='font-semibold'>{user.name}</h1>

                    </div>
    </div>
    </Link>
  )
}

export default SingleChat