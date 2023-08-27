import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./NotSubscribedPage.css";

export default function NotSubscribedPage() {

  const navigate = useNavigate();
    
  useEffect(() => {
        let isAuth = JSON.parse(localStorage.getItem('userData'));
        if(isAuth && isAuth.user.subscribed === true) {
          
            navigate("/provider/dashboard");
        }
    }, []);

    const navigateToPayment = () => navigate("/provider/dashboard/payment");

  return (
    <div className="not-subscribed__container">
      <h2 className="fw-bold">You need to subscribe to access full features</h2>
      <div className="subscription-plans__container">
        <div className="subscribtion-item">
          <h5 className="fw-bold mb-4">Basic Plan</h5>
          <div className="w-100 d-flex align-items-center">
            <h1 className="fw-bold">$15</h1>
            <sub>/month</sub>
          </div>
          <hr className="bg-dark w-100" />
          <div className="features-list">
            <small><img width="25" height="25" src="https://img.icons8.com/color/25/checked--v1.png" alt="checked--v1"/> Everything is simple</small>
            <small><img width="25" height="25" src="https://img.icons8.com/color/25/checked--v1.png" alt="checked--v1"/> Access all features</small>
            <small><img width="25" height="25" src="https://img.icons8.com/color/25/checked--v1.png" alt="checked--v1"/> Unlimited management</small>
            <small><img width="25" height="25" src="https://img.icons8.com/color/25/checked--v1.png" alt="checked--v1"/> Customer storage plan</small>
          </div>
          <button className="btn mt-4" onClick={navigateToPayment}>Get Basic Plan</button>
        </div>
      </div>
    </div>
  );
}
