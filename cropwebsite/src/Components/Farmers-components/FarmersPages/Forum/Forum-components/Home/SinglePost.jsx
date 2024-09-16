import React, { useDebugValue } from 'react';
import { CiCalendar } from "react-icons/ci";
import { FaRegComment, FaRegHeart, FaRegUser } from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { timeAgo } from '../../../../../../utils/libs';
import { useMainContext } from '../../../../../../ context';
import api from '../../../../../../../api';
import { useGlobalContext as useCommentContext } from '../Context';
import { IoIosCreate } from "react-icons/io";
import EditPost from './EditPost';
const SinglePost = ({pst}) => {
    const [post, setPost] = React.useState(pst)
    const {title, description, comments:comm, likes:lik, createdAt, username, id, liked_by_user, likes_count} = post
    const {userData, token} = useMainContext();
    const [clickedComment, setClickedComment] = React.useState(false)
    const [openModal, setOpenModal] = React.useState(false)

    const [comments, setComments] = React.useState(comm.map(
        ({author, content, created_at})=>{
          
            return {
                author,
                comment:content,
                createdAt: created_at
            }
        }
    ))


    const handleLike = (isLiked) => {
      

     api.post(
           isLiked? `/discussion/posts/${id}/unlike/` : `/discussion/posts/${id}/like/` , {
              post:id
            }, { headers:{Authorization: `Token ${token}`}}
          )
          
          .then(
            ({status, data})=>{
             
             if(status===200){
                setPost(
                    {...post, liked_by_user:!isLiked, likes_count: isLiked? likes_count-1: likes_count+1}
                )
              
                api.get(
                    `/discussion/posts/${id}`,  { headers:{Authorization: `Token ${token}`}}).then(
                        ({status, data})=>{
                            
                            if(status===200){
                     
                                setPost(
                                    {
                                        ...data, createdAt: data.created_at,  username: data.author === userData.id ? userData.username:"testUser",
                                    }
                            )
                            }
                        }
                    )
                }})
                
          
        
    }
  return (
    
    <div className='bg-white p-3 my-2 shadow-md rounded-md'>
    {openModal &&
    <EditPost setOpenModal={setOpenModal} id={id} tit={title} desc={description} setPost={setPost}/>}
    <div className='flex flex-row justify-between '>
    <div>
    <h1 className='text-lg font-semibold'>{title}</h1>
    <div className='flex '>
        <div className='flex   items-center pe-2'>
            <FaRegUser className=' text-gray-500 pe-1' />
            <h1 className=' text-gray-500 '>{username}</h1>
        </div>
        <div className='flex   items-center'>
            <CiCalendar className=' text-gray-500 pe-1 text-lg' />
            <h1 className=' text-gray-500  opacity-90 text-sm'>{timeAgo(createdAt)}</h1>
        </div>
    </div>
    </div>
    { userData.username === username &&
    <div className='flex'  onClick={()=>{setOpenModal(true)}}>
        <IoIosCreate className='text-green-700 cursor-pointer text-2xl' />
        <small className=' align-center font-bold'>Edit</small>

        
    </div>
    }
    </div>
    <p className='text-sm'>{description}</p>
    <div className='border-t pt-2 flex space-x-2'>
        <div className='flex items-center me-2 space-x-1 cursor-pointer '>
        <div onClick={()=>{
            handleLike(liked_by_user)
        }} >
            {liked_by_user? <IoMdHeart className=' text-lg text-red-500' />:<FaRegHeart className=' text-lg hover:text-red-400 ' />}
            </div>
            <h1 className='text-xs'>{likes_count}</h1>
        </div>
        <div className={`flex items-center space-x-1 cursor-pointer hover:text-green-900 ${clickedComment? " text-green-800":""}`} onClick={()=>setClickedComment(!clickedComment)}>
            <FaRegComment className={`text-lg`} />
            <h1 className='text-xs'>{comments.length===0 ? "No": comments.length} Comments</h1>
            {!clickedComment ? <MdKeyboardArrowDown className='text-lg' />:<MdKeyboardArrowUp className='text-lg' />}
        </div>
    </div>
    <div className='mt-3'>

        {clickedComment && <CommentSection comments={comments} id={id} setComments={setComments}  />}
        </div>
    
  </div>
  )
}

const CommentSection = ({comments, id, setComments}) => {
   const {newPostAlert, setNewPostAlert} = useCommentContext()
    const {token, userData} = useMainContext();
    
    const [comment, setComment] = React.useState('')
    const handleSubmit = (e) => {
        e.preventDefault()
        if(comment===''){
            setComment('')
        }
        const res =  api.post(
            `/discussion/posts/${id}/add_comment/`, {
              post:id, content:comment
            }, { headers:{Authorization: `Token ${token}`}}
          ).then(
            ({status, data})=>{
             if(status===201){
              
                api.get(
                    `/discussion/posts/${id}`,  { headers:{Authorization: `Token ${token}`}})
                .then(
                    ({status, data})=>{
                        if(status===200){
                        console.log(status)
                            setComments(data.comments.map(
                                ({author, content, created_at})=>{
                                    return {
                                        author,
                                        comment:content,
                                        createdAt: created_at
                                    }
                                }
                            ))
                        }
                    }
                )
                
              
              console.log('success!', data)

             } 
            }
          )
       setComment('')
    }
    comments.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
    )
    return (
        <div className='  '>
        <div>
        <form className='flex flex-col px-3' onSubmit={handleSubmit}>
        <input type='text' placeholder='Add a reply...'  className='border-b-2 border-gray-600 mb-3 placeholder:ps-2 ' onChange={(e)=>setComment(e.target.value)} value={comment} />
       <div className='flex  justify-end'>
         <button className='  text-black p-2 mx-3 rounded-3xl hover:bg-gray-500 hover:text-white ' type='button' onClick={()=>setComment("")} >Cancel</button>
        <button className='bg-green-700 text-white p-2 px-3 rounded-3xl shadow' type='submit' >Reply</button>
       </div>
        </form>
        </div>
        <div className='pt-3 space-y-3 border-l-2 border-l-black ps-3'>
            {comments.map((comment, index) => (
                <div>
                <div key={index} className='flex items-center space-x-2'>
                <div className='flex'>
              
                    <h1 className=' text-black  pe-1'>@{comment.author}</h1>
                    <small className='text-xs place-self-center text-gray-500'>{timeAgo(comment.createdAt)}</small>
                    </div>
                  
                </div>
                <h1 className='text-sm mt-1'>{comment.comment}</h1>
                </div>
            ))}
            </div>
        </div>
    )
}

export default SinglePost