import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BackBtn from '../../../components/BackBtn';
import experts from '../Messages/users';
import { FaChevronCircleRight } from "react-icons/fa";
import { formatDate } from '../../../utils/libs';
const SingleChat = () => {
const {id} = useParams();
const [message, setMessage] = useState('');
const [messages, setMessages] = useState([]);
const [newMessage, setNewMessage] = useState('');
const userId = id.split("_")[0];

function isNotObtainedDate(obtained_date, current_date) {
    const currentDate = new Date(current_date);
    const obtainedDate = new Date(obtained_date);
  
    // Compare the day, month, and year
    if (
      currentDate.getDate() !== obtainedDate.getDate() ||
      currentDate.getMonth() !== obtainedDate.getMonth() ||
      currentDate.getFullYear() !== obtainedDate.getFullYear()
    ) {
      return true;
    } else {
      return false;
    }
  }
  useEffect(()=>{
    window.scrollTo(0,document.body.scrollHeight);
    const consultation =  JSON.parse(localStorage.getItem("consultation") || '{}');
    console.log(consultation)
    setMessages(consultation[id] || []);



  }, [newMessage])

//find user
const user = experts.find((usr)=>{
    return usr.id === userId;

})
const handleSend = (e)=>{
    e.preventDefault();
    if(message.trim() === ""){
        return;
    }
    const newMessage = {
        message,
        sender:"expert",
        date: new Date().toISOString()
    }
    const consultation =  JSON.parse(localStorage.getItem("consultation") || '{}');
    const allMessages = [...messages, newMessage];
    consultation[id] = allMessages;
    localStorage.setItem("consultation", JSON.stringify(consultation));
    setMessage("");
    setNewMessage( Math.random());
}
useEffect(()=>{

})

let curr_date = new Date('1970-01-01').toISOString();
  return (
<>
<BackBtn />
 <div className='relative'>
 

 <div className='flex sticky top-0 bg-white  inset-x-0 items-center py-2  z-30 pl-12 shadow pb-3 '>
                 <img src={user.img} alt={user.name} className='rounded-full w-10 h-10' />
                 <div className='ml-3 '>
                 <div className=' justify-self-start'>
                 <h1 className='font-semibold'>{user.name}</h1>

</div>
                 </div>
 </div>


 
 <div className='my-20 sticky bottom-20 w-full space-y-2 p-4  z-0 overflow-y-scroll '> 
 {
     messages.map((mess)=>{
       
         const isNotObtainDate = isNotObtainedDate(mess.date, curr_date);

         if(isNotObtainDate){
             curr_date = mess.date;
         }

         return (
<div className='flex flex-col' >
{ isNotObtainDate &&
<small className=' self-center text-xs text-gray-600 font-semibold my-3'>{formatDate(mess.date)}</small>}
             <div className={`${mess.sender==="farmer"?" self-start bg-gray-400 text-black ":"self-end  bg-green-700 text-white"} p-2 rounded-full text-sm text-center`}>

                 {mess.message}
             </div>
             </div>
         )
     })
 }


 </div>
 <div className=' fixed pl-5   bottom-5    w-11/12 '
 >
    <form  onSubmit={handleSend}>
<div className='relative'>
         <input type="text" placeholder='Message...' className='border-2 p-2 rounded-3xl w-full pl-5' value={message} onChange={(e)=>{
             setMessage(e.target.value)
         }} />
         <button type='submit'>
         <FaChevronCircleRight className='absolute text-2xl right-3 top-3 text-green-900' />
         </button>
         </div>
     </form>
 </div>
 </div>
 
 </>
  )
}

export default SingleChat