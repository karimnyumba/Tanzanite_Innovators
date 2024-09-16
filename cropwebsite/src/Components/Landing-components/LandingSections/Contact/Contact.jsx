import React from 'react'
import './Contact.css'
import msg_icon from '../../../../assets/msg-icon.png'
import mail_icon from '../../../../assets/mail-icon.png'
import phone_icon from '../../../../assets/phone-icon.png'
import location_icon from '../../../../assets/location-icon.png'
// import white_arrow from  '../../../../assets/white-arrow.png'

const Contact = () => {
    const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset(); //To reset the data from the form after submission
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };
  return (
    <div className='contact' id='contact'>
        <div className="contact-col">
            <h3>Send us a message <img src={msg_icon}alt="" /></h3>
            <p>We're here to help! Whether you have 
                a question about our services or want to 
                discuss a partnership, feel free to reach out 
                to us.</p>
            <ul>
                <li><img src={mail_icon} alt="" />info@Kilimo Kipya.com</li>
                <li><img src={phone_icon} alt="" />+255 784 030 683</li>
                <li><img src={location_icon} alt="" />UDSM-CoICT, Sayansi-Kijitonyama<br /> Dar es Salaam, 
                Tanzania</li>
            </ul>
        </div>
        <div className="contact-col">
            <form onSubmit={onSubmit}>
                <label>Your name</label>
                <input type="text" name="name" placeholder='Enter your name' required/>
                <label>Phone Number</label>
                <input type="tel" name='phone' placeholder='Enter your mobile number' required />
                <label>Email</label>
                <input type="email" name='email' placeholder='Enter your email' required />
                <label>Write your message here</label>
                <textarea name='message'rows="6" placeholder='Enter your message' required></textarea>
                <button type='submit' className='btn dark-btn'>Submit Now</button>
            </form>
            <span>{result}</span>
        </div>
    </div>
  )
}

export default Contact