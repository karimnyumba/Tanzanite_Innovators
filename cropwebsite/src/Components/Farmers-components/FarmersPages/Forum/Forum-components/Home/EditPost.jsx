import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdCancel } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';
import { useGlobalContext } from '../Context';
import api from '../../../../../../../api';
import { useMainContext } from '../../../../../../ context';

const EditPost = ({id, tit, desc, setPost, setOpenModal}) => {
    const [title, setTitle] = useState(tit)
    const {setNewPostAlert, newPostAlert} = useGlobalContext()
   
    const [description, setDescription] = useState(desc)
    const {token, userData}= useMainContext();
    
    const handleSubmit = (e) => {
      e.preventDefault()
      if(title==='' || description===''){
        return toast.error('Please fill all the fields')
      }
  
      // post forum
  
  
      
       const res =  api.put(
          `/discussion/posts/${id}/`, {
            title, content:description
          }, { headers:{Authorization: `Token ${token}`}}
        ).then(
          ({status, data})=>{
            console.log(status, data)
           if(status===200){
            toast.success('Edit success!')
            api.get(
                `/discussion/posts/${id}/`,  { headers:{Authorization: `Token ${token}`}}).then
                (
                    ({status, data})=>{
                        if(status===200){
                            console.log(status)
                            setPost({
                                ...data, createdAt: data.created_at,description:data.content,  username: data.author === userData.id ? userData.username:"testUser",
                            })
                        }
                    }
                )
           } 
          }
        )
      
      setTitle('')
      setDescription('')
      setOpenModal(false)
     
      setNewPostAlert(!newPostAlert)
    }
  
  return (
    <div className=' fixed top-0 left-0 h-full w-full bg-black bg-opacity-50' >
    <div className='bg-white w-80  h-80 rounded-md shadow fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
    <div> 
      <h1 className='text py-3 ps-3 font-semibold'>Edit Post</h1>
      <MdCancel className='text-2xl text-gray-500 absolute top-2 right-2' onClick={()=>setOpenModal(false)} />
      </div>
      <form className='flex flex-col px-3'>
        <label htmlFor='title' className='text-xs' >Title</label>
        <input type='text' placeholder='Add Title' className='border p-1 mb-3 placeholder:ps-1 rounded' onChange={(e)=>setTitle(e.target.value)} value={title}/>
        <label htmlFor='description' className='text-xs' >Description</label>
        <textarea placeholder='Add Description' className='border p-1   h-32 placeholder:ps-1 rounded' onChange={(e)=>setDescription(e.target.value)} value={description}></textarea>
        <div className='flex justify-between mt-2'>
        <button className='border border-red-300  text-black p-2 w-48 mx-3 rounded shadow' onClick={()=>setOpenModal(false)}>Cancel</button>
        <button className='bg-green-700 text-white p-2 w-48 rounded shadow' type='button' onClick={handleSubmit}>Edit Post</button>
    
        </div>
      </form>
      </div>
  </div>
  )
}

export default EditPost