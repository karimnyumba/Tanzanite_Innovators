import React, { useRef } from 'react'
import './Testimonials.css'
import next_icon from '../../../../assets/next-icon.png'
import back_icon from '../../../../assets/back-icon.png'
import user_1 from '../../../../assets/user-1.png'
import user_2 from '../../../../assets/user-2.png'
import user_3 from '../../../../assets/user-3.png'
import user_4 from '../../../../assets/user-4.png'

const Testimonials = () => {

  const slider = useRef();
  let tx = 0;

  const slideForward = () =>{
    if(tx > -50){
        tx -= 25;
    }
    slider.current.style.transform = `translateX(${tx}%)`

    // if (tx === -50) {
    //     tx = 25
    // }
  }

  const slideBackward = () =>{
    if(tx < 0){
        tx += 25;
    }
    slider.current.style.transform = `translateX(${tx}%)`
  }

  return (
    <div className='testimonials'>
        <img src={next_icon} className='next-btn' onClick={slideForward}/>
        <img src={back_icon} className='back-btn' onClick={slideBackward}/>
        <div className="slider">
            <ul ref={slider}>
                <li>
                    <div className="slide">
                        <div className="user-info">
                            <img src={user_1} alt="" />
                            <div>
                                <h3>Pendo John</h3>
                                <span>Ngara, Kagera</span>
                            </div>
                        </div>
                        <p>Kilimo Kipya has revolutionized 
                            how I manage my farm. With its 
                            intuitive features, I can now track 
                            crop data and market trends easily.</p>
                    </div>
                </li>
                <li>
                    <div className="slide">
                        <div className="user-info">
                            <img src={user_2} alt="" />
                            <div>
                                <h3>Juma Rajabu</h3>
                                <span>Tukuyu, Mbeya</span>
                            </div>
                        </div>
                        <p>Kilimo Kipya's consultation service helped 
                            me improve my pest control strategies, 
                            leading to higher yields. It's a game-changer 
                            for farmers!</p>
                    </div>
                </li>
                <li>
                    <div className="slide">
                        <div className="user-info">
                            <img src={user_3} alt="" />
                            <div>
                                <h3>Zainabu Khamis</h3>
                                <span>Kilombero, Morogoro</span>
                            </div>
                        </div>
                        <p>Using Kilimo Kipya, I've increased my crop sales 
                            by 30% thanks to its marketplace functionality. 
                            Highly recommended for farmers!</p>
                    </div>
                </li>
                <li>
                    <div className="slide">
                        <div className="user-info">
                            <img src={user_4} alt="" />
                            <div>
                                <h3>James Peter</h3>
                                <span>Ilemela, Mwanza</span>
                            </div>
                        </div>
                        <p>Kilimo Kipya's forum allows me to connect 
                            with other farmers and share insights. 
                            It's a valuable resource for anyone in 
                            the agricultural community.</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
  )
}

export default Testimonials