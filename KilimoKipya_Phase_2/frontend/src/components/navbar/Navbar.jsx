import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { SiSellfy, } from "react-icons/si";
import { GiFarmTractor } from "react-icons/gi";
import { FaFacebookF } from 'react-icons/fa';
import { notify } from "../../utils/helper/notification";
import Cart from "../../pages/cart";
import { useCookies } from "react-cookie";

function Navbar() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies([
    "user_access_token",
    "seller_access_token",
    "brandName"
  ]);

  const userDropdownRef = useRef();
  const sellerDropdownRef = useRef();

  const [openCart, setOpenCart] = useState(false);

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showSellerDropdown, setShowSellerDropdown] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }

      if (
        sellerDropdownRef.current &&
        !sellerDropdownRef.current.contains(event.target)
      ) {
        setShowSellerDropdown(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white border-gray-200 shadow">
      <div className="flex flex-wrap items-center justify-between mx-auto px-4 md:px-12 h-12 max-w-7xl ">
        <a href="/" className="flex items-center">
          <span className="text-xl md:text-2xl font-medium whitespace-nowrap">
          Kilimo
            <span className="text-green-500 font-bold">Kipya</span>
          </span>
        </a>
        <div className="flex flex-row gap-4 md:gap-8 text-2xl md:text-3xl">
        { !cookies.seller_access_token &&
          <div
            ref={userDropdownRef}
            className="relative flex flex-row gap-1 justify-center items-center text-blue-700 cursor-pointer"
            onMouseEnter={() => {
              setShowUserDropdown(true);
              setShowSellerDropdown(false);
            }}
            onClick={() => {
              if (!cookies.user_access_token) {
                navigate("/account/user");
              }
            }}
          >
            <FaUserCircle />
            <span className="text-sm font-medium hidden md:block">User</span>
            {cookies.user_access_token && (
              <div
                className={`absolute ${
                  showUserDropdown ? "block" : "hidden"
                } top-8 right-0 z-50 font-medium bg-white rounded-lg shadow-md pl-1 md:pl-4 pr-2 md:pr-8 py-0 md:py-2`}
              >
                <ul className="py-1 md:py-2 flex flex-col text-sm gap-2 text-gray-700 z-50 ">
                  <li
                  className="hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0  whitespace-nowrap cursor-pointer hover:text-blue-700"
                    onClick={() => {
                      console.log("User log out clicked");
                      setCookie("user_access_token", "", {expires: new Date(0) });
                      notify("User Logged Out", "info");
              
                      navigate("/");
                    }}
                  >
                    <a className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0  whitespace-nowrap cursor-pointer hover:text-blue-700">
                      User Logout
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        }
          { !cookies.user_access_token &&
          <div
            ref={sellerDropdownRef}
            className="relative flex flex-row gap-1 justify-center items-center text-green-700 cursor-pointer"
            onMouseEnter={() => {
              setShowSellerDropdown(true);
              setShowUserDropdown(false);
            }}
            onClick={() => {
              if (!cookies.seller_access_token) {
                navigate("/account/seller");
              }
            }}
          >
           <span className="text-white bg-green-700 p-1 m-1 rounded-sm"> <FaFacebookF  size={15} /></span>

            <span className="text-sm font-medium hidden md:block">Farmer</span>
            {cookies.seller_access_token && (
              <div
                className={`absolute ${
                  showSellerDropdown ? "block" : "hidden"
                } top-8 right-0 z-50 font-medium bg-white rounded-lg shadow-md pl-1 md:pl-4 pr-2 md:pr-8 py-0 md:py-2`}
              >
                <ul className="py-2 flex flex-col text-sm gap-2 text-gray-700 ">
                  <li
                    onClick={() => {
                      navigate("/sellerdashboard");
                    }}
                  >
                    <a className="block px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0  whitespace-nowrap">
                      Farmer Dashboard
                    </a>
                  </li>
                  <li
                    onClick={() => {
                      console.log("Seller log out clicked");
                      setCookie("seller_access_token", "", {expires: new Date(0) });
                      setCookie("brandName", "", {expires: new Date(0) });

                      navigate("/");
                      notify("Seller Logged Out", "info");
                    }}
                  >
                    <a className="block px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0  whitespace-nowrap">
                      Farmer Logout
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
          }
          { !cookies.seller_access_token &&
          <div
            className="flex flex-row gap-1 justify-center items-center text-red-700 cursor-pointer"
            onClick={() => {
              setOpenCart(true);
            }}
          >
            <AiOutlineShoppingCart />
            <span className="text-sm font-medium hidden md:block">Cart</span>
          </div>
          }
          <div className="relative flex flex-row gap-1 justify-center items-center text-green-700 cursor-pointer">
          {/* <button className="text-base font-semibold">Connect</button> */}
        </div>
          {openCart && <Cart setOpenCart={setOpenCart} />}
        </div>
     
      </div>
    </nav>
  );
}

export default Navbar;
