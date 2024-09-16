import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdCancel } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';
import { useGlobalContext } from '../Context';
import api from '../../../../../../../api';
import { useMainContext } from '../../../../../../ context';
const CreatePost = ({setOpenModal}) => {
  const [title, setTitle] = useState('')
  const {setNewPostAlert, newPostAlert} = useGlobalContext()
 
  const [description, setDescription] = useState('')
  const {token}= useMainContext();
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if(title==='' || description===''){
      return toast.error('Please fill all the fields')
    }

    // post forum


    
     const res =  api.post(
        '/discussion/posts/', {
          title, content:description
        }, { headers:{Authorization: `Token ${token}`}}
      ).then(
        ({status, data})=>{
         if(status===201){
          toast.success('success!')
         } 
        }
      )
    

  

    

    // set up local storage
    let forum = JSON.parse(localStorage.getItem('forum')) || null
    if(forum===null){
      forum = new Object()
    }
    const id = uuidv4()
    forum[id] = {title, description, id, comments: [], likes:0, createdAt: new Date().toISOString()}
    localStorage.setItem('forum', JSON.stringify(forum))
    setTitle('')
    setDescription('')
    setOpenModal(false)
   
    setNewPostAlert(!newPostAlert)
  }

  return (
    <div className=' fixed top-0 left-0 h-full w-full bg-black bg-opacity-50' >
      <div className='bg-white w-80  h-80 rounded-md shadow fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
      <div> 
        <h1 className='text py-3 ps-3 font-semibold'>Create Post</h1>
        <MdCancel className='text-2xl text-gray-500 absolute top-2 right-2' onClick={()=>setOpenModal(false)} />
        </div>
        <form className='flex flex-col px-3'>
          <label htmlFor='title' className='text-xs' >Title</label>
          <input type='text' placeholder='Add Title' className='border p-1 mb-3 placeholder:ps-1 rounded' onChange={(e)=>setTitle(e.target.value)}/>
          <label htmlFor='description' className='text-xs' >Description</label>
          <textarea placeholder='Add Description' className='border p-1   h-32 placeholder:ps-1 rounded' onChange={(e)=>setDescription(e.target.value)}></textarea>
          <div className='flex justify-between mt-2'>
          <button className='border border-red-300  text-black p-2 w-48 mx-3 rounded shadow' onClick={()=>setOpenModal(false)}>Cancel</button>
          <button className='bg-green-700 text-white p-2 w-48 rounded shadow' type='button' onClick={handleSubmit}>Create Post</button>
      
          </div>
        </form>
        </div>
    </div>
  )
}

export default CreatePost