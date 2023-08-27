import React, { useEffect, useState } from "react";
import "./ContactUs.css";

import { useHttpClient } from "../../hooks/http-hook";

export default function ContactUs() {
  const { sendRequest } = useHttpClient();

  const [contactUsContent, setContactUsContentContent] = useState([]);
  const [feedbackData, setFeedbackData] = useState({
    userEmail: "",
    fullName: "",
    userPhone: "",
    message: ""
  });

  const handleChange = (e) => {
    setFeedbackData({
      ...feedbackData,
      [e.target.name]: e.target.value
    })
  };

  const fetchConacttUsContent = async () => {
    try {
      let responseData = await sendRequest(
        "http://localhost:5000/api/admin/get-contactus-content"
      );
      if (responseData) setContactUsContentContent(responseData[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const addFeedbackHandler = async (event) => {
    event.preventDefault();

    try {
      let responseData = await sendRequest("http://localhost:5000/api/users/add-new-feedback",
      "POST",
      JSON.stringify(feedbackData),
      {
        "Content-Type": "application/json",
      }
      );

      console.log(responseData);
    } catch(err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchConacttUsContent();
  }, []);

  return (
    <div className="contact-us__container">
      <div className="contact-us__header">
        <h1 className="text-light fw-bold">Contact Us</h1>
      </div>
      <div className="contact-us__body">
        <div className="container">
          <div className="row w-100">
            <div className="col-xs-12 col-lg-6">
              <h1 className="text-uppercase fw-bold mb-3">
                get in touch with us
              </h1>
              <p>
                If you have any questions or feel confused about something, do
                not hesitate and contact us now...we are here for you
              </p>
              <div className="contactUs-items">
                <div className="item">
                  <i className="bx bxs-map"></i>
                  <div className="d-flex flex-column">
                    <h5 className="fw-bold mb-2">Our Location</h5>
                    <h6>{contactUsContent?.our_location}</h6>
                  </div>
                </div>
                <div className="item">
                  <i className="bx bxs-phone"></i>
                  <div className="d-flex flex-column">
                    <h5 className="fw-bold mb-2">Phone Number</h5>
                    <h6>{contactUsContent?.phonenumber}</h6>
                  </div>
                </div>
                <div className="item">
                  <i className="bx bxs-envelope"></i>
                  <div className="d-flex flex-column">
                    <h5 className="fw-bold mb-2">Email Address</h5>
                    <h6>{contactUsContent?.email}</h6>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-lg-6">
              <div className="contact-us__form">
                <form onSubmit={addFeedbackHandler}>
                <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="fullName"
                      id="fullName"
                      placeholder="Your Name"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      name="userEmail"
                      id="emailAddress"
                      placeholder="Your Email"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="userPhone"
                      id="phoneNumber"
                      placeholder="Your Phone"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      name="message"
                      id="message"
                      placeholder="Youe Message"
                      rows="5"
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <button className="btn" type="submit">Send Message</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
