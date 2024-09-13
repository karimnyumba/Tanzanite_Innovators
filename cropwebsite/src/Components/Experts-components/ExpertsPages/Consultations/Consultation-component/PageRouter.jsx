import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import UserMessages  from "./pages/User/Messages/Messages.jsx";
import UserSingleChat from "./pages/User/SingleChat/SingleChat.jsx";
import ExpertMessages from "./pages/Expert/Messages/Messages.jsx";
import  ExpertSingleChat from "./pages/Expert/SingleChat/SingleChat.jsx";
import "./output.css"
const PageRouter = () => {
  return (
    
      <Routes>

        <Route path="/" element={<ExpertMessages />} />
        <Route path="/:id" element={<ExpertSingleChat />} />

      </Routes>
    
  )
}

export default PageRouter