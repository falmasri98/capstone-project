import React, { useEffect, useState } from 'react';
import "./AboutUs.css";

import { useHttpClient } from "../../hooks/http-hook";

export default function AboutUs() {

    const { sendRequest} = useHttpClient();
    const [aboutusContent, setAboutusContent] = useState([]);

    const fetchAboutUsContent = async () => {
        try {
            let responseData = await sendRequest("http://localhost:5000/api/admin/get-aboutus-content");
            if(responseData) setAboutusContent(responseData[0]);
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAboutUsContent();
    }, []);

  return (
    <div className='about-us__container'>
        <div className="about-us__header">
            <h1 className='text-light fw-bold'>About Us</h1>
        </div>
        <div className="about-us__content mt-5 container">
            <div className='mb-5'>
            <h2 className='fw-bold mb-4'>Main Features</h2>
            <p>{aboutusContent?.main_us_text}</p>
            </div>
            <div>
            <h2 className='fw-bold mb-4'>Why to choose us?</h2>
            <p>{aboutusContent?.why_choose_us}</p>
            </div>
        </div>
    </div>
  )
}
