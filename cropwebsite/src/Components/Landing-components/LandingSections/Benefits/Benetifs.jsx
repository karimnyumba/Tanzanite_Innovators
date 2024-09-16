import React from 'react';
import './Benefits.css';
import efficiency_icon from '../../../../assets/efficiency.png';
import cost_savings_icon from '../../../../assets/cost-savings.png';
import communication_icon from '../../../../assets/communication.png';
import accessibility_icon from '../../../../assets/accessibility.png';

const Benefits = () => {
  const benefits = [
    {
      icon: efficiency_icon,
      title: 'Increased Profitability',
      description: 'Kilimo Kipya helps farmers optimize their crop management practices, leading to higher yields and better market access, ultimately increasing profitability.'
    },
    {
      icon: cost_savings_icon,
      title: 'Market Access',
      description: "By showcasing their produce on Kilimo Kipya's marketplace, farmers can reach a wider audience of buyers, expanding their market reach and potential sales."
    },
    {
      icon: communication_icon,
      title: 'Expert Guidance',
      description: 'Kilimo Kipya provides access to agricultural experts who offer personalized advice, helping farmers make informed decisions and improve their farming practices.'
    },
    {
      icon: accessibility_icon,
      title: 'Efficiency and Time Savings',
      description: 'With features like real-time data access and streamlined processes, Kilimo Kipy helps farmers save time and effort in managing their crops and accessing market information.'
    }
  ];

  return (
    <div className="benefits">
      {benefits.map((benefit, index) => (
        <div key={index} className="benefit">
          <img src={benefit.icon} alt={`Icon ${index + 1}`} />
          <h3>{benefit.title}</h3>
          <p>{benefit.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Benefits;
