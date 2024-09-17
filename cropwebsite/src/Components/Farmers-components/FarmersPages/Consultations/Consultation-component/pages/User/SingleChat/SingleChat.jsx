import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BackBtn from '../../../components/BackBtn';
import experts from '../../Home/experts';
import { FaChevronCircleRight } from "react-icons/fa";
import { formatDate } from '../../../utils/libs';
import  expImage7 from '../../../assets/images/expert7.jpeg';
import api from '../../../../../../../../../api';
import { useMainContext } from '../../../../../../../../ context';
import api2 from '../../../../../../../../../api2';
const SingleChat = () => {
const {id} = useParams();
const [message, setMessage] = useState('');
const [messages, setMessages] = useState([]);
const [newMessage, setNewMessage] = useState('');
const expertId = id.split("_")[1];
const {token, userData} = useMainContext();
const [expert, setExpert] = useState({

}); 
const socket = React.useRef(null);

async function fetchExpert(){
  const {data} =  await  api.get(
    `/seek-advice/extension-officer/${expertId}/`,  { headers:{Authorization: `Token ${token}`}})
   
  setExpert(data)
}
useEffect(
  ()=>{
    fetchExpert()


  },[]
)
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

 useEffect(
  ()=>{
    async function fetchMessages(){
     
      const {data:{results}} = await api2.get(
        `/messages?room=${id}`
      )
      setMessages(results)

    }
    fetchMessages();  
  },[]
 )



 useEffect(() => {
  // Create WebSocket connection
  
  socket.current = new WebSocket(`wss://fierylion.me/ws/room/${id}/`);

  // Connection opened
  socket.current.onopen = () => {
    console.log('WebSocket is open now.');
  };

  // Listen for messages
  socket.current.onmessage = (event) => {
 
    const message = JSON.parse( event.data);
    setMessages(prevMessages => [...prevMessages, message.message]);
    setNewMessage(Math.random())
  };

  // Handle errors
  socket.current.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  // Connection closed
  socket.current.onclose = () => {
    console.log('WebSocket is closed now.');
  };

  // Clean up WebSocket connection when component unmounts
  return () => {
    if (socket.current) {
      socket.current.close();
    }
  };
}, []);

  useEffect(()=>{
    window.scrollTo(0,document.body.scrollHeight);
    


  }, [newMessage])




const handleSend = (e)=>{
    e.preventDefault();
    if(message.trim() === ""){
        return;
    }
    const newMessage = {
        content:message,
        creator:"user",
        username:userData.username,
        created_at: new Date().toISOString()
    }
 
    if (socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify(newMessage));
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setMessage("");

    setNewMessage( Math.random());
    } else {
      console.error('WebSocket is not open.');
    }
  
}

let curr_date = new Date('1970-01-01').toISOString();

  return (
    <>
   <BackBtn />
    <div className=''>
    
  
    <div className='flex sticky top-0 bg-white  inset-x-0 items-center py-2  z-10 pl-12 shadow pb-3 '>

                    <div className='ml-3 '>
                    <div className=' justify-self-start'>
                    <h1 className='font-semibold'>Dr.{expert.username}</h1>
                
</div>
                    </div>
    </div>
  
  
    
    <div className='my-20 sticky bottom-20 w-full space-y-2 p-4  z-0 overflow-y-scroll '> 
    {
        messages.map((mess)=>{
          
            const isNotObtainDate = isNotObtainedDate(mess.created_at, curr_date);

            if(isNotObtainDate){
                curr_date = mess.created_at;
            }

            return (
<div className='flex flex-col' >
{ isNotObtainDate &&
<small className=' self-center text-xs text-gray-600 font-semibold my-3'>{formatDate(mess.created_at)}</small>}
                <div className={`${mess.creator==="expert"?" self-start bg-gray-400 text-black ":"self-end  bg-green-700 text-white"} p-2 rounded-full text-sm text-center`}>

                    {mess.content}
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