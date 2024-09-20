import React from 'react'
import { GoLinkExternal } from "react-icons/go";
import Heading from '../../components/heading/Heading';
const RecommenderTool = () => {
  return (
<>
<Heading text={"Crop Recommender System"} textAlign="text-left" />
<div className='ml-5'>
<div className="space-y-4 ">
            <h2 className="text-xl font-semibold">Crop Recommender Tool </h2>
            <div className='space-y-4 py-5'>
            <p>Discover the best crops to grow based on your specific farm conditions! Our Crop Recommender Tool provides tailored crop suggestions using data on soil health, weather patterns, and market demand. With just a click, get personalized recommendations that will help you maximize yields, improve profitability, and make informed decisions for your farm.</p>
            <p className=''>
            Our advanced Crop Recommender System uses cutting-edge algorithms and extensive 
              agricultural data to suggest the most suitable crops for your specific conditions. 
              By analyzing factors such as soil type, climate, water availability, and market trends, 
              we provide personalized recommendations to optimize your crop yield and profitability.
            </p>
            </div>
            <button
              onClick={() => window.open('https://cfat-kilimokipya.vercel.app/', '_blank')}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-800"
            >
              Try Our Crop Recommender
              <GoLinkExternal size={16} />
            </button>
          </div>




</div>
</>
  )
}

export default RecommenderTool