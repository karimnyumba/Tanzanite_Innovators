import React from 'react'
import './About.css'
import about_img from '../../../../assets/about.jpg'
// import play_icon from '../../../../assets/play-icon.png'

const About = () => {
  return (
    <div className='about' id='about'>
        <div className="about-left">
            <img src={about_img} className='about-img' />
            {/* <img src={play_icon} className='play-icon' /> */}
        </div>
        <div className="about-right">
            <h3>About Kilimo Kipya</h3>
            <h2>Revolutionizing Agriculture for a Sustainable Future</h2>
            <p>Empowering farmers with comprehensive crop information, 
              marketing tools, and expert knowledge, Kilimo Kipya is transforming agriculture. </p>
            <p>Revolutionizing farming practices for a sustainable future, Kilimo Kipya provides 
              innovative solutions to enhance crop management and market access.</p>
            <p>With Kilimo Kipya, farmers can access real-time data and personalized 
              recommendations, optimizing their operations for increased efficiency and profitability.</p>
        </div>
    </div>
  )
}

export default About