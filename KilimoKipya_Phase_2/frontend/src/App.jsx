// import './App.css'
import React, { useEffect, useMemo } from "react";
import LoginAndSignup from "./pages/account";
import { BrowserRouter as Router, Routes, Route, redirect } from "react-router-dom";
import Product from "./pages/products";
import Navbar from "./components/navbar/Navbar";
import SellerDashboard from "./pages/seller_dashboard";
import ProductDashboard from "./pages/product_details";
import Order from "./pages/orders";
import LeafletMap from "./components/map/LeafletMap";
import SellerProductOperation from "./pages/seller_product_operation";
import ShowMap from "./pages/map";
import { Analytics } from "@vercel/analytics/react";
import ScrollToTop from "./components/scroll/ScrollToTop";
import Footer from "./components/footer/Footer";
import Home from "./pages/home";
import Verify from "./pages/verify";
import Welcome from "./pages/welcome";
import { useCookies } from "react-cookie";

function App() {

  const [cookies, setCookie] = useCookies([
    "user_access_token",
    "seller_access_token",
    "brandName"
  ]);
  useEffect(() => {
    console.log(cookies.user_access_token)
    if(window.location.pathname === "/"){
    if(cookies.user_access_token){

      window.location.href = "/user";
    }
    if(cookies.seller_access_token){
      window.location.href = "/sellerdashboard";
    }
  }
  }, [cookies]);

  return (
    <>
      <Router>
        <ScrollToTop />
        <Navbar />
        {/* <div className="min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-50px)]"> */}
          <Routes>
            <Route exact path="/" element={ <Welcome />} />
            <Route exact path="/user" element={<Home />} />
            <Route exact path="/account/:type" element={<LoginAndSignup />} />
            <Route exact path="/:type/verify/:token" element={<Verify />} />
            <Route
              exact
              path="/sellerdashboard"
              element={<SellerDashboard />}
            />
            <Route
              exact
              path="/map/:latitude/:longitude"
              element={<ShowMap />}
            />
            <Route
              exact
              path="/sellerdashboard/product/:operation"
              element={<SellerProductOperation />}
            />
            <Route exact path="/category/:type" element={<Product />} />
            <Route
              exact
              path="/category/:type/details/:productId"
              element={<ProductDashboard />}
            />
            <Route exact path="/orders" element={<Order />} />
            <Route exact path="/map" element={<LeafletMap />} />
          </Routes>
        {/* </div> */}
      </Router>
    {/* <div className="py-10"></div> */}
      <Footer />
      <Analytics />
    </>
  );
}

export default App;
