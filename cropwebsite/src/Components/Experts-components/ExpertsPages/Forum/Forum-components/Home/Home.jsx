import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../Context';
import Navbar from '../components/Navbar';
import SinglePost from './SinglePost';


const Home = () => {
  const sections = [ "All Posts", "Most Liked"]
  const [activeSection, setActiveSection] = useState(0)
  const [posts, setPosts] = useState([])
  const {newPostAlert} = useGlobalContext()
  useEffect(() => {
    const posts = JSON.parse(localStorage.getItem('forum')) || []
    // it is objects {id: {title, description, comments, likes, createdAt}}
    const postsArray = Object.keys(posts).map((key) => {
      return posts[key]
    })
    if(activeSection===1){
      // most liked
      postsArray.sort((a, b) => {
        return b.likes - a.likes
      })}
    else if(activeSection===0){
      //  new posts
      postsArray.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
      })}
    
    setPosts(postsArray)
    console.log(postsArray)
  }, [activeSection, newPostAlert]);

  return (
    <div className='font-roboto'>
    <Navbar />
    <div className='mx-2'>
   
      <div className='flex'>
        {sections.map((section, index) => (
          <div key={index} className={`p-2 m-2 ${ activeSection===index ?"bg-green-700 text-white":"bg-green-200 text-black"} shadow-md rounded-md`} onClick={()=>{setActiveSection(index)}} >
            <h1 className={`text-lg font-semibold `}>{section}</h1>
          </div>
        ))}
      </div>

      

    </div>
    <div className='mx-2'>
      {  posts.map((post, index) =>{
   
        return  (
        <SinglePost key={post.id}  post={post} />
      )}
      )}
      </div>
    </div>
  )
}

export default Home