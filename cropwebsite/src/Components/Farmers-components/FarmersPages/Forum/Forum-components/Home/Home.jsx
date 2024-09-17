import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../Context';
import { useMainContext } from  '../../../../../../ context';
import Navbar from '../components/Navbar';
import SinglePost from './SinglePost';
import api from '../../../../../../../api';

const Home = () => {
  const sections = [ "All Posts", "Most Liked"]
  const {userData, token} = useMainContext()
  const [activeSection, setActiveSection] = useState(0)
  const [posts, setPosts] = useState([])
  const {newPostAlert} = useGlobalContext()


  useEffect( () => {
    async function fetchPosts(){
      console.log(userData, token)
      const {data:{results}} =  await  api.get(
        '/discussion/posts/',  { headers:{Authorization: `Token ${token}`}}
      )
      const postsArray = results.map(
        (it)=>{
          const { title, author, content, comments, created_at, id, liked_by_user, likes_count} = it;
          return {
            id,
        username: author === userData.id ? userData.username:"testUser",
            liked_by_user,
            likes_count,
            comments,
            title, 
            description:content,
            createdAt:created_at
  
          }
        }
      )
      console.log(postsArray)
      if(activeSection===1){
        // most liked
        postsArray.sort((a, b) => {
          return b.likes_count - a.likes_count
        })}
      else if(activeSection===0){
        // all forums
        postsArray.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt)
        })}
     
      setPosts(postsArray)
    }
   fetchPosts();
  
  }, [activeSection, newPostAlert]);

  return (
    <div className='font-roboto'>
    <Navbar />
    <div className='mx-2'>
   
      <div className='flex'>
        {sections.map((section, index) => (
          <div key={index} className={`p-2 m-2 cursor-pointer  ${ activeSection===index ?"bg-green-700 text-white":"border-2 text-black hover:bg-green-700 hover:text-white"} shadow-md rounded-md`} onClick={()=>{setActiveSection(index)}} >
            <h1 className={`text-lg font-semibold `}>{section}</h1>
          </div>
        ))}
      </div>

      

    </div>
    <div className='mx-2'>
      {  posts.map((post, index) =>{

   
   
        return  (
        <SinglePost key={post.id}  pst={post} />
      )}
      )}
      </div>
    </div>
  )
}

export default Home