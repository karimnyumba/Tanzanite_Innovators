import React from 'react'

const HoverRound = ({children,  variant}) => {
    const variants = {
        round1 : ' p-2 rounded-full  hover:bg-green-600  transition duration-200 ',
    }

  return (
    <div className={variants[variant]}>
        {children}
    </div>
  )
}

export default HoverRound