import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useParams } from "react-router-dom";

import Breadcrumb from "../../UI/Breadcrumb";
import SuccessModal from "../../UI/SuccessModal";
import { useHttpClient } from "../../hooks/http-hook";
import { useAuth } from "../../hooks/auth-hook";
import moment from "moment";

import chip from "../../assets/chip.png";
import visa from "../../assets/visa.png";
import "./StoresPage.css";

export default function SingleStore() {
  let params = useParams();
  const { sendRequest } = useHttpClient();
  const { userId } = useAuth();

  const [services, setServices] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cash");
  const [selectedService, setSelectedService] = useState();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  // const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isValidCard, setIsValidCard] = useState(true);

  // For Pagination
  const [offset, setOffset] = useState(0);
  const [perPage] = useState(6);
  const [pageCount, setPageCount] = useState(0);

  const fetchAllServices = async () => {
    try {
      let responseData = await sendRequest(
        `http://localhost:5000/api/users/get-services`
      );

      const slice = responseData
        .filter(
          (service) =>
            service.provider_id == params["storeId"] &&
            service.available === true &&
            service.count > 0
        )
        .slice(offset, offset + perPage);

      setServices(slice);
      setPageCount(Math.ceil(responseData.length / perPage));
      setStoreName(responseData[0]["username"]);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setOffset(selectedPage + 1);
  };

  const handleOpen = (bagId) => {
    setSelectedService(bagId);
    setOpenPaymentModal(true);
  };

  const handleClose = () => setOpenPaymentModal(false);
  const handleSuccessClose = () => setOpenSuccessModal(false);

  const orderSurpriseBag = async (e, bagId) => {
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

    try {
      let responseData = await sendRequest(
        "http://localhost:5000/api/users/add-new-order",
        "POST",
        JSON.stringify({
          bag_id: bagId,
          user_id: userId,
          order_date: moment().format("MMMM Do YYYY, h:mm:ss a"),
        }),
        {
          "Content-Type": "application/json",
        }
      );

      if (responseData["bagAdded"]) {
        setOpenSuccessModal(true);
        fetchAllServices();
        handleClose();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllServices();
  }, []);

  useEffect(() => {
    if(selectedPaymentMethod === 'visa') {
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
        document?.querySelector(".month-input").value;
    };

    document.querySelector(".year-input").oninput = () => {
      document.querySelector(".exp-year").innerText =
        document?.querySelector(".year-input").value;
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
  }
  }, []);


  const visaContent = (
    <div className="user-payment__container">
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

        <form onSubmit={(e) => orderSurpriseBag(e, selectedService)}>
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
      </div>
  );

  // const successContnet = <p>Order Added Successfully!</p>;

  return (
    <div className="single-store__container">
      <SuccessModal
        open={openPaymentModal}
        close={handleClose}
        title="Confirm Order"
        orderSurpriseBag={orderSurpriseBag}
        cash={selectedPaymentMethod === 'cash'}
        bagId={selectedService}
      >
        <p className="w-100 text-left">
          Please choose payment option you prefer:
        </p>
        <div className="row w-100 mb-4">
          <div className="col px-0">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                id="inlineFormCheck"
                name="payment"
                value="cash"
                onClick={(e) => setSelectedPaymentMethod(e.target.value)}
              />
              <label
                className="form-check-label fw-bold"
                htmlFor="inlineFormCheck"
              >
                Cash
              </label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                id="inlineFormCheck1"
                name="payment"
                value="visa"
                onClick={(e) => setSelectedPaymentMethod(e.target.value)}
              />
              <label
                className="form-check-label fw-bold"
                htmlFor="inlineFormCheck"
              >
                Visa
              </label>
            </div>
          </div>
        </div>
        {selectedPaymentMethod === "visa" && visaContent}
        {selectedPaymentMethod === "cash" && (
          <p>You can pay when your order is delivered to you.</p>
        )}
      </SuccessModal>
      <SuccessModal
        title="Order Submitted Successfully"
        open={openSuccessModal}
        close={handleSuccessClose}
      >
        <h4>your order has been added successfully</h4>
        <lottie-player
          src="https://assets8.lottiefiles.com/packages/lf20_jbrw3hcz.json"
          background="transparent"
          speed="1"
          style={{ width: "300px", height: "300px" }}
          loop
          autoplay
        ></lottie-player>
      </SuccessModal>
      <div className="stores-page__header">
        <img
          width="96"
          height="96"
          src="https://img.icons8.com/color/96/small-business.png"
          alt="small-business"
        />
        <h1 className="text-light fw-bold text-capitalize mb-2">{storeName}</h1>
        <Breadcrumb prev={"stores"} current={storeName} />
      </div>
      <div className="single-store__services">
        <h4 className="fw-bold mb-5">Available Surprise Bags</h4>
        <div className="d-flex align-items-center justify-content-center">
          <div className="mb-5 store-searchbar">
            {/* <input
            type="text"
            className="form-control"
            placeholder="Search for resturants, hotels, etc..."
            onChange={(e) => setSearchValue(e.target.value)}
          /> */}
            <select
              className="form-select"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all" defaultValue>
                All
              </option>
              <option value="food">Food</option>
              <option value="sweet">Sweet</option>
            </select>
          </div>
        </div>
        <div className="services-list mb-5">
          {selectedCategory === "all" &&
            services?.map((item) => (
              <div key={item.id} className="store-service__item">
                <img
                  width="94"
                  height="94"
                  src="https://img.icons8.com/3d-fluency/94/shopping-bag.png"
                  alt="shopping-bag"
                />
                <h4 className="text-capitalize fw-bold mb-3 mt-1">
                  {item.service_type} surprise bag
                </h4>
                <p className="text-center fw-bold">
                  This bag contains a {item.service_category} category items
                </p>
                <h6 className="mb-4">{item.count} Bags left</h6>
                <button
                  className="btn btn-primary"
                  onClick={() => handleOpen(item.service_id)}
                  disabled={!item.count}
                >
                  Order Bag
                </button>
              </div>
            ))}
          {selectedCategory !== "all" &&
            services
              ?.filter((service) => service.service_type === selectedCategory)
              ?.map((item) => (
                <div key={item.id} className="store-service__item">
                  <img
                    width="94"
                    height="94"
                    src="https://img.icons8.com/3d-fluency/94/shopping-bag.png"
                    alt="shopping-bag"
                  />
                  <h4 className="text-capitalize fw-bold mb-3 mt-1">
                    {item.service_type} surprise bag
                  </h4>
                  <p className="text-center fw-bold">
                    This bag contains a {item.service_category} category items
                  </p>
                  <h6 className="mb-4">{item.count} Bags left</h6>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleOpen(item.service_id)}
                    disabled={!item.count}
                  >
                    Order Bag
                  </button>
                </div>
              ))}
          {services?.length === 0 && (
            <div className="empty-services__list">
              <h5 className="fw-bold">There is no available bags to order</h5>
            </div>
          )}
        </div>
        <ReactPaginate
          previousLabel={"prev"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={6}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
}
