import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./AuthPage.css";

import UserForm from '../../components/Auth/UserForm'; 

export default function AuthPage() {

  const navigate = useNavigate();
    useEffect(() => {
        let isAuth = JSON.parse(localStorage.getItem('userData'));
        if(isAuth && isAuth !== null) {
            navigate("/");
        }
    }, []);

  return (
    <div className='Auth-page__container'>
        <div className="row w-100">
            <div className="col-xs-12 col-lg-8 px-5">
            <h2 data-aos="fade-right" className='fw-bold'><img width="48" height="48" src="https://img.icons8.com/fluency/48/taco.png" alt="taco"/> Good Food, Good Mood</h2>
                <UserForm />
            </div>
            <div className="col-xs-12 col-lg-4 center">
              <h2 className='text-light fw-bold mb-5' data-aos="zoom-in">Save the planet at closing time</h2>
              <lottie-player src="https://assets8.lottiefiles.com/private_files/lf30_m6j5igxb.json"  background="transparent"  speed="1"  style={{width: "300px", height: "300px"}}  loop  autoplay></lottie-player>
            </div>
        </div>
    </div>
  )
}
