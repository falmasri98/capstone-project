import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import { useHttpClient } from "../../hooks/http-hook";
import { useAuth } from "../../hooks/auth-hook";

import Sidebar from "../../UI/Sidebar";
import DashboardTitle from "../../UI/DashboardTitle";

import Home from "./Home/Home";
import Profile from "./Profile/Profile";

export default function CustomerDashboard() {

  const myData = JSON.parse(localStorage.getItem("userData"));

  const { user } = useAuth();
  const { sendRequest } = useHttpClient();

  const [userOrders, setUserOrders] = useState([]);
  const [userData, setUserData] = useState([]);

  const fetchUserData = async () => {
    try {
      let responseData = await sendRequest(`http://localhost:5000/api/users/get-user-details/${myData?.userId}`);
      setUserData(responseData[0]);
    } catch(err) {
      console.log(err);
    }
  };

  const fetchUserOrders = async () => {
    try {
      let responseData = await sendRequest(`http://localhost:5000/api/users/get-user-orders/${myData?.userId}`);
      setUserOrders(responseData);
    } catch(err) { 
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchUserOrders();
  }, []);
  return (
    <div>
      <Sidebar />
      <div className="home">
        <DashboardTitle name={user?.username} />
        <Routes>
          <Route
            index
            element={
              <Home
                userOrders={userOrders}
                fetchUserOrders={fetchUserOrders}
              />
            }
          />
          <Route
            path="/home"
            element={
              <Home
              userOrders={userOrders}
              fetchUserOrders={fetchUserOrders}
              />
            }
          />
         <Route path="/profile" element={<Profile fetchUserData={fetchUserData} userData={userData} />} />
        </Routes>
      </div>
    </div>
  )
}
