import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import { useHttpClient } from "../../hooks/http-hook";
import { useAuth } from "../../hooks/auth-hook";

import Sidebar from "../../UI/Sidebar";
import DashboardTitle from "../../UI/DashboardTitle";

import Home from "./Home/Home";
import Profile from "./Profile/Profile";
import Services from "./Services/Services";
import Orders from "./Orders/Orders";
import NotSubscribedPage from "./NotSubscribedPage/NotSubscribedPage";
import Payment from "./Payment/Payment";

export default function ProviderDashboard() {

  const navigate = useNavigate();
  const { userId, user } = useAuth();
  const { sendRequest } = useHttpClient();

  const [providerData, setProviderData] = useState();
  const [providerServices, setProviderServices] = useState([]);
  const [providerOrders, setProviderOrders] = useState([]);

  const fetchProviderData = async () => {
    try {
      let responseData = await sendRequest(`http://localhost:5000/api/providers/provider-details/${userId}`);
      setProviderData(responseData[0]);
    } catch(err) {
      console.log(err);
    }
  };

  const fetchProviderServices = async () => {
    try {
      let responseData = await sendRequest(`http://localhost:5000/api/providers/get-services/${userId}`);
      setProviderServices(responseData);
    } catch(err) {
      console.log(err);
    }
  };

  const fetchProviderOrders = async () => {
    try {
      let responseData = await sendRequest(`http://localhost:5000/api/providers/get-provider-orders/${userId}`);
      setProviderOrders(responseData);
    } catch(err) {
      console.log(err);
    }
  };

  const handleSubscribtionPlan = async () => {
    try {
      let responseData = await sendRequest(`http://localhost:5000/api/providers/add-new-subscribtion/${userId}`, 
      "PATCH",
      );

      if(responseData['providerSubscribed']) {
        fetchProviderData();
        navigate("/provider/dashboard");
      }
    } catch(err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // let isAuth = JSON.parse(localStorage.getItem('userData'));
        if(providerData && providerData.subscribed === false) {
            navigate("/provider/dashboard/not-subscribed");
        }
  }, [providerData]);

  useEffect(() => {
    if(!userId) return;
    // if(user && !user.subscribed) navigate("/provider/dashboard/not-subscribed");
    fetchProviderData();
    fetchProviderServices();
    fetchProviderOrders();
  }, [userId, user]);


  return (
    <div>
      <Sidebar isSubscribed={providerData?.subscribed} />
      <div className="home">
        <DashboardTitle name={providerData?.username} />
        <Routes>
          <Route
            index
            element={
              <Home />
            }
          />
          <Route
            path="/home"
            element={
              <Home />
            }
          />
          {providerData && <Route path="/profile" element={<Profile fetchProviderData={fetchProviderData} providerData={providerData} />} />}
          <Route path="/services" element={<Services servicesList={providerServices} />} />
          <Route path="/orders" element={<Orders orders={providerOrders} fetchProviderOrders={fetchProviderOrders} />} />
          <Route path="/not-subscribed" element={<NotSubscribedPage />} />
          <Route path="/payment" element={<Payment handleSubscribtionPlan={handleSubscribtionPlan} />} />
        </Routes>
      </div>
    </div>
  )
}
