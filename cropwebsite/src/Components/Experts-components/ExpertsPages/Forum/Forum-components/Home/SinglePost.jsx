import React from 'react';
import { CiCalendar } from "react-icons/ci";
import { FaRegComment, FaRegHeart, FaRegUser } from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { timeAgo } from '../../../../../../utils/libs';
const SinglePost = ({post}) => {
    const {title, description, comments:comm, likes:lik, createdAt} = post
    
    const [clickedComment, setClickedComment] = React.useState(false)
    const [comments, setComments] = React.useState(comm)
    const [likes, setLikes] = React.useState(lik)
    const [liked, setLiked] = React.useState(false)
    const handleLike = (incr) => {
        let forum = JSON.parse(localStorage.getItem('forum'))
        incr ? forum[post.id].likes += 1 : forum[post.id].likes -= 1
        setLikes(forum[post.id].likes)
        localStorage.setItem('forum', JSON.stringify(forum))
        setComments([...forum[post.id].comments])
    }
  return (
    <div className='bg-white p-3 my-2 shadow-md rounded-md'>
    <h1 className='text-lg font-semibold'>{title}</h1>
    <div className='flex '>
        <div className='flex   items-center pe-2'>
            <FaRegUser className=' text-gray-500 pe-1' />
            <h1 className=' text-gray-500 '>john</h1>
        </div>
        <div className='flex   items-center'>
            <CiCalendar className=' text-gray-500 pe-1 text-lg' />
            <h1 className=' text-gray-500  opacity-90 text-sm'>{timeAgo(createdAt)}</h1>
        </div>
    </div>
    <p className='text-sm'>{description}</p>
    <div className='border-t pt-2 flex space-x-2'>
        <div className='flex items-center me-2 space-x-1 cursor-pointer '>
        <div onClick={()=>{
            if(liked){
                handleLike(false)
                setLiked(false)
            }
            else{
                handleLike(true)
                setLiked(true)
            }
        }} >
            {liked? <IoMdHeart className=' text-lg text-red-500' />:<FaRegHeart className=' text-lg hover:text-red-400 ' />}
            </div>
            <h1 className='text-xs'>{likes===0 ? "No": likes} Likes</h1>
        </div>
        <div className={`flex items-center space-x-1 cursor-pointer hover:text-green-900 ${clickedComment? " text-green-800":""}`} onClick={()=>setClickedComment(!clickedComment)}>
            <FaRegComment className={`text-lg`} />
            <h1 className='text-xs'>{comments.length===0 ? "No": comments.length} Comments</h1>
            {!clickedComment ? <MdKeyboardArrowDown className='text-lg' />:<MdKeyboardArrowUp className='text-lg' />}
        </div>
    </div>
    <div className='mt-3'>

        {clickedComment && <CommentSection comments={comments} id={post.id} setComments={setComments} />}
        </div>
    
  </div>
  )
}

const CommentSection = ({comments, id, setComments}) => {
   
    const [comment, setComment] = React.useState('')
    const handleSubmit = (e) => {
        e.preventDefault()
        if(comment==='') return
        let forum = JSON.parse(localStorage.getItem('forum'))
        forum[id].comments.push({
            comment,
            user: 'joe',
            createdAt: new Date().toISOString()
        })
        setComments([...forum[id].comments])
        localStorage.setItem('forum', JSON.stringify(forum))
        setComment('')
    }
    comments.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
    )
    return (
        <div className='  '>
        <div>
        <form className='flex flex-col px-3'>
        <input type='text' placeholder='Add a reply...'  className='border-b-2 border-gray-600 mb-3 placeholder:ps-2 ' onChange={(e)=>setComment(e.target.value)} value={comment} />
       <div className='flex  justify-end'>
         <button className='  text-black p-2 mx-3 rounded-3xl hover:bg-gray-500 hover:text-white ' type='button' onClick={()=>setComment("")} >Cancel</button>
        <button className='bg-green-700 text-white p-2 px-3 rounded-3xl shadow' type='button' onClick={handleSubmit}>Reply</button>
       </div>
        </form>
        </div>
        <div className='pt-3 space-y-3 border-l-2 border-l-black ps-3'>
            {comments.map((comment, index) => (
                <div>
                <div key={index} className='flex items-center space-x-2'>
                <div className='flex'>
              
                    <h1 className=' text-black  pe-1'>@{comment.user}</h1>
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