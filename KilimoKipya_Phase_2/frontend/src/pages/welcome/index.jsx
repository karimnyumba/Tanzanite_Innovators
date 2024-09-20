import React from "react"
import pic1 from "/images/welcome/pic1.png"
import pic2 from "/images/welcome/pic2.jpg"
import pic3 from "/images/welcome/pic3.jpg"
import { useNavigate } from "react-router-dom"
import { GoLinkExternal } from "react-icons/go"
import Home from  "../home/index2"
export default function FarmersMarketplace() {
    const navigate = useNavigate();
  return (
    <>
    <div className="flex flex-col lg:flex-row ">
    <div className="w-full lg:w-1/2 relative">
      <img
        src={pic1}
        alt="Farmers in a field"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-purple-600 bg-opacity-20 flex flex-col justify-between p-6">
        <h2 className="text-4xl lg:text-5xl font-medium text-white mb-2">
          <span className="text-black">Farmers </span>
          <span className="text-green-700">Marketplace</span>
        </h2>
        <p className="text-white text lg:text-lg font-light my-auto">
          Connecting Farmers to the Market. Our platform empowers farmers by providing
          direct access to buyers, fostering growth, and ensuring fair trade.
        </p>
        <div className="space-y-8 self-center  ">
      
            <p className="text-white text-sm lg:text-base font-light my-auto">We've also got a powerful crop recommender tool to help you choose the best crops for your farm based on soil, climate, and market trends. Maximize your yields and profits with tailored insights!</p>
            <button
          onClick={() => window.open('https://frontend-system-dusky.vercel.app/', '_blank')}
          className="w-full sm:w-1/2 flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-800"
        >
          Try Our Crop Recommender
          <GoLinkExternal size={16} />
        </button>
        </div>
       

      
      </div>
    </div>

    <div className="w-full lg:w-1/2 p-8 lg:my-auto ">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="text-center">
          <img
            src={pic2}
            alt="Farmer with produce"
            className="rounded-xl mx-auto mb-4 h-48 w-48 object-cover"
          />
          <h3 className="text-2xl font-bold text-green-500 mb-2">Farmer</h3>
          <p className="text-xl text-green-600 mb-2">Your Market, Your Rules.</p>
          <p className="mb-4">
            Log in or register to manage your listings, connect with buyers, and
            grow your farming business.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              className="p-2 px-4 bg-green-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105" 
              onClick={() => navigate("/account/seller?operation=register")}
            >
              Register
            </button>
            <button 
              className="p-2 px-4 border border-green-500 text-green-500 text-lg font-semibold rounded-xl shadow-lg hover:bg-green-50 hover:text-green-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105" 
              onClick={() => navigate("/account/seller?operation=login")}
            >
              Log In
            </button>
          </div>
        </div>

        <div className="text-center">
          <img
            src={pic3}
            alt="Buyer smiling"
            className="rounded-xl mx-auto mb-4 h-48 w-48 object-cover"
          />
          <h3 className="text-2xl font-bold text-blue-500 mb-2">Buyer</h3>
          <p className="text-xl text-blue-600 mb-2">Connect with Local Farmers.</p>
          <p className="mb-4">
            Sign up or log in to explore fresh produce and support the farming
            community by purchasing directly.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              className="p-2 px-4 bg-blue-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105" 
              onClick={() => navigate("/account/user?operation=register")}
            >
              Register
            </button>
            <button 
              className="p-2 px-4 border border-blue-500 text-blue-500 text-lg font-semibold rounded-xl shadow-lg hover:bg-blue-50 hover:text-blue-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105" 
              onClick={() => navigate("/account/user?operation=login")}
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Home/>
  </>
  )
}