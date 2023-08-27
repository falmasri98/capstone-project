import React, { useEffect, useState } from "react";
import "./Payment.css";

import chip from "../../../assets/chip.png";
import visa from "../../../assets/visa.png";

export default function Payment({ handleSubscribtionPlan }) {

  const [isValidCard, setIsValidCard] = useState(true);

  useEffect(() => {
    document.querySelector(".card-number-input").oninput = () => {
      document.querySelector(".card-number-box").innerText =
        document.querySelector(".card-number-input").value;
    };

    document.querySelector(".card-holder-input").oninput = () => {
      document.querySelector(".card-holder-name").innerText =
        document.querySelector(".card-holder-input").value;
    };

    document.querySelector(".month-input").oninput = () => {
      document.querySelector(".exp-month").innerText =
        document.querySelector(".month-input").value;
    };

    document.querySelector(".year-input").oninput = () => {
      document.querySelector(".exp-year").innerText =
        document.querySelector(".year-input").value;
    };

    document.querySelector(".cvv-input").onmouseenter = () => {
      document.querySelector(".front").style.transform =
        "perspective(1000px) rotateY(-180deg)";
      document.querySelector(".back").style.transform =
        "perspective(1000px) rotateY(0deg)";
    };

    document.querySelector(".cvv-input").onmouseleave = () => {
      document.querySelector(".front").style.transform =
        "perspective(1000px) rotateY(0deg)";
      document.querySelector(".back").style.transform =
        "perspective(1000px) rotateY(180deg)";
    };

    document.querySelector(".cvv-input").oninput = () => {
      document.querySelector(".cvv-box").innerText =
        document.querySelector(".cvv-input").value;
    };
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();

    let visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
    let cardNumber = document?.getElementById("card-number").value;
    let cardHolder = document?.getElementById("card-holder").value;
    let expDate = document?.getElementById("exp-date").value;
    let expYear = document?.getElementById("exp-year").value;
    let date = new Date();
    let isValidDate = ((date.getMonth() + 1) < expDate && date.getFullYear() == expYear) || expYear > date.getFullYear();

    if(!visaRegEx.test(cardNumber) || !cardHolder || !isValidDate) {
      setIsValidCard(false);
      return;
    }

    handleSubscribtionPlan();
  };

  return (
    <div className="provider-payment__container">
      <h2>Please enter your information to complete your subscription:</h2>
      <div className="container">
        <div className="card-container">
          <div className="front">
            <div className="image">
              <img src={chip} alt="chip" />
              <img src={visa} alt="visa" />
            </div>
            <div className="card-number-box">################</div>
            <div className="flexbox">
              <div className="box">
                <span>card holder</span>
                <div className="card-holder-name text-uppercase">full name</div>
              </div>
              <div className="box">
                <span>expires</span>
                <div className="expiration">
                  <span className="exp-month">mm</span>
                  <span>/</span>
                  <span className="exp-year">yy</span>
                </div>
              </div>
            </div>
          </div>

          <div className="back">
            <div className="stripe"></div>
            <div className="box">
              <span>cvv</span>
              <div className="cvv-box"></div>
              <img src="image/visa.png" alt="" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubscribe}>
        {!isValidCard && <div className="d-flex align-items-center justify-content-center mt-4 alert alert-danger">
        <h5>Please check your details</h5>
        </div>}
          <div className="inputBox">
            <span>card number</span>
            <input type="text" maxLength="16" className="card-number-input" id="card-number" />
          </div>
          <div className="inputBox">
            <span>card holder</span>
            <input type="text" className="card-holder-input" id="card-holder" />
          </div>
          <div className="flexbox">
            <div className="inputBox">
              <span>expiration mm</span>
              <select name="" className="month-input" id="exp-date">
                <option value="month" defaultValue disabled>
                  month
                </option>
                <option value="01">01</option>
                <option value="02">02</option>
                <option value="03">03</option>
                <option value="04">04</option>
                <option value="05">05</option>
                <option value="06">06</option>
                <option value="07">07</option>
                <option value="08">08</option>
                <option value="09">09</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
            </div>
            <div className="inputBox">
              <span>expiration yy</span>
              <select id="exp-year" className="year-input">
                <option value="year" defaultValue disabled>
                  year
                </option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
                <option value="2029">2029</option>
                <option value="2030">2030</option>
              </select>
            </div>
            <div className="inputBox">
              <span>cvv</span>
              <input type="text" maxLength="3" className="cvv-input" />
            </div>
          </div>
          <button className="submit-btn mt-4" type="submit">
            Confirm Payment
          </button>
        </form>
      </div>
      {/* <div className="wrapper">
        <div className="cc-types">
          <img className="cc-types__img cc-types__img--amex" />
          <img className="cc-types__img cc-types__img--visa" />
          <img className="cc-types__img cc-types__img--mastercard" />
          <img className="cc-types__img cc-types__img--disc" />
          <img className="cc-types__img cc-types__img--genric" />
        </div>
        <input type="text" maxLength="19" className="cc-number-input" />

        <input type="text" maxLength="5" className="cc-expiry-input" />
        <input type="text" maxLength="3" className="cc-cvc-input" />
      </div>
      <button className="btn mt-4" onClick={handleSubscribtionPlan}>
        Confirm Payment
      </button> */}
    </div>
  );
}
