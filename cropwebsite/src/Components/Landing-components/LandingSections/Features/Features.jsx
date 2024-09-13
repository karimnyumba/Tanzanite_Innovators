import React from 'react';
import './Features.css';
import speech_icon from '../../../../assets/info.jpg'
import school_py_icon from '../../../../assets/market.jpg'
import assistants_icon from '../../../../assets/forum.jpg'

const Features = () => {
  return (
    <div className="features" id='features'>
        <div className='title'>
        <h2>Features</h2>
        <p style={{ color: '#676767' }}>Discover how Kilimo Kipya connects farmers with essential tools and resources. 
          From comprehensive crop information to marketing opportunities and expert 
          consultations, Kilimo Kipya revolutionizes farming practices for a sustainable 
          future.</p>
    </div>
      <div className="feature-card">
        <div className="front">
          <img src={speech_icon} alt="Feature Icon" />
          <h3>Comprehensive Crops Information</h3>
        </div>
        <div className="back">
          <p>Provides comprehensive and detailed information 
            on cultivation practices, pest control, soil management, 
            and other essential aspects of crop management, empowering 
            farmers with the knowledge needed to optimize their crop 
            yields and quality.</p>
        </div>
      </div>

      <div className="feature-card">
        <div className="front">
    <img src={school_py_icon} alt="Feature Icon" />
          <h3>Marketing Opportunities</h3>
        </div>
        <div className="back">
          <p>Offers farmers a platform to explore and capitalize 
            on marketing opportunities by providing tools to analyze 
            market trends, access a marketplace for buying and 
            selling agricultural produce, and connect with potential 
            buyers, thereby enhancing their market reach and 
            profitability.</p>
        </div>
      </div>

      <div className="feature-card">
        <div className="front">
          <img src={assistants_icon} alt="Feature Icon" />
          <h3>Experts Knowledge and Forum Discussions</h3>
        </div>
        <div className="back">
          <p>Allows farmers to receive personalized advice and 
            consultations from agricultural experts, as well as 
            engage in discussions and share insights on farming 
            practices and market trends through the Kilimo Kipya 
            forum.</p>
        </div>
      </div>

      {/* <div className="feature-card">
        <div className="front">
          <img src={occupational_icon} alt="Feature Icon" />
          <h3>Occupational Therapists (OTs)</h3>
        </div>
        <div className="back">
          <p>Our OTs are committed to helping students develop or 
            recover the skills needed for daily living and 
            academic success, focusing on sensory and motor skills. 
            The implementation of tele-therapy broadens the impact 
            of OTs by facilitating remote assessments and 
            interventions.</p>
        </div>
      </div>

      <div className="feature-card">
        <div className="front">
          <img src={physical_icon} alt="Feature Icon" />
          <h3>Physical Therapists (PTs)</h3>
        </div>
        <div className="back">
          <p> Focused on improving mobility, our PTs work with 
            students to enhance physical capabilities, ensuring 
            that every child can participate fully in school activities 
            and beyond. Tele-therapy in physical therapy allows for 
            innovative approaches to exercise, movement, 
            and rehabilitation.</p>
        </div>
      </div>

      <div className="feature-card">
        <div className="front">
          <img src={teacher_icon} alt="Feature Icon" />
          <h3>School Social Workers</h3>
        </div>
        <div className="back">
          <p>Addressing social, emotional, and life adjustment 
            issues, our social workers are at the forefront of 
            creating positive school climates where all students 
            can thrive. Tele-therapy sessions provide a flexible 
            and approachable means for students to receive the 
            support they need.</p>
        </div>
      </div>

      <div className="feature-card">
        <div className="front">
          <img src={sign_lang_icon} alt="Feature Icon" />
          <h3>Sign Language Interpreters:</h3>
        </div>
        <div className="back">
          <p>Ensuring that hearing-impaired students receive 
            the support they need, our interpreters facilitate 
            communication and learning, making the educational 
            experience accessible to everyone. Our dedication 
            to incorporating tele-therapy extends to this essential 
            service, ensuring that interpreters can assist students 
            remotely..</p>
        </div>
      </div> */}
      {/* Add more feature cards here */}
    </div>
  );
}

export default Features;
