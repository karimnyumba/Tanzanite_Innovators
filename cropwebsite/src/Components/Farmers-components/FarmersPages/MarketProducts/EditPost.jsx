import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdCancel } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';
import { useGlobalContext } from './Context';
import api from '../../../../../api';
import { useMainContext } from '../../../../ context';

const EditPost = ({tit, pri, qua, des,setOpenModal, id}) => {
  const [title, setTitle] = useState(tit)
  const [price, setPrice] = useState(pri)
  const [quantity, setQuantity] = useState(qua)
  
  const {setNewPostAlert, newPostAlert} = useGlobalContext()
 
  const [description, setDescription] = useState(des)
  const {token}= useMainContext();
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if(title==='' || description==='' || price===0 || quantity===0){
      return toast.error('Please fill all the fields')
    }

    // post forum


    
     const res =  api.patch(
        `/products/${id}/`, {
          name:title,description, price, quantity
        }, { headers:{Authorization: `Token ${token}`}}
      ).then(
        ({status, data})=>{
         if(status===200){
          toast.success('success!')
          setNewPostAlert(!newPostAlert)
          setOpenModal(false)
         
         } 
        }
      ).catch(
        (err)=>{
          toast.error('An error occured')
        })
    

  

    

    // set up local÷
  }

  return (
    <div className=' fixed top-0 left-0 h-full w-full bg-black bg-opacity-50' >
      <div className='bg-white w-80  rounded-md shadow fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
      <div className='py-3'> 
        <h1 className='text py-3 ps-3 font-semibold'>Create Crop</h1>
        <MdCancel className='text-2xl text-gray-500 absolute top-2 right-2' onClick={()=>setOpenModal(false)} />
        </div>
        <form className='flex flex-col px-3'>
          <label htmlFor='title' className='text-xs' >Name</label>
          <input type='text' value={title}  placeholder='Add Title' className='border p-1 mb-3 placeholder:ps-1 rounded' onChange={(e)=>setTitle(e.target.value)}/>
          <label htmlFor='price' className='text-xs' >Price</label>
          <input type='number' value={price} placeholder='Add Price' className='border p-1 mb-3 placeholder:ps-1 rounded' onChange={(e)=>{
            setPrice(e.target.value)
          }} />
          <label htmlFor='quantity' className='text-xs' >Quantity</label>
          <input type='number' placeholder='Add Quantity' value={quantity} className='border p-1 mb-3 placeholder:ps-1 rounded' onChange={(e)=>setQuantity(e.target.value)} />
          <label htmlFor='description' className='text-xs' >Description</label>
          <textarea placeholder='Add Description' value={description} className='border p-1   h-32 placeholder:ps-1 rounded' onChange={(e)=>setDescription(e.target.value)}></textarea>
          
          <div className='flex justify-between my-3'>
          <button className='border border-red-300  text-black p-2 w-48 mx-3 rounded shadow' onClick={()=>setOpenModal(false)}>Cancel</button>
          <button className='bg-green-700 text-white p-2 w-48 rounded shadow' type='button' onClick={handleSubmit}>Edit Crop</button>
      
          </div>
        </form>
        </div>
    </div>
  )
}

export default EditPost