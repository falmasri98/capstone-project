import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./HomePage.css";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

export default function HomePage() {
  const { t } = useTranslation();

  const [headerStyles, setHeaderStyles] = useState({
    position: "absoulte",
    background: "transparent"
  });

  const listenScrollEvent = () => {
    const mainWrapperElement = document.getElementById("app-main__wrapper");
    const mainWrapperElementOffset = mainWrapperElement.offsetTop;
    if(window.scrollY >= mainWrapperElementOffset) {
      setHeaderStyles({
        position: "fixed",
        background: "#6c757d"
      })
    } 

    if(window.scrollY === 0) {
      setHeaderStyles({
        position: "absolute",
        background: "transparent"
      })
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", listenScrollEvent);
    return () => {
      window.removeEventListener("scroll", listenScrollEvent);
    };
  }, []);

  return (
    <div className="home-page__container">
      <div className="main-wrapper">
      <div className="app-navbar" style={{...headerStyles, transition: "all 1s"}}>
        <Navbar />
      </div>
      <div className="app-starter__container app_section text-light" id="app-main__wrapper">
        <div className="container">
          <div className="row mb-5">
            <div className="col-xs-12 center">
              <h1 className="mb-4 fw-bold">{t("hp-heading")}</h1>
              <p>{t("hp-smallText")}</p>
              <div className="app-features__conatainer mt-5">
                <div className="feature">
                  <img
                    width="54"
                    height="54"
                    src="https://img.icons8.com/nolan/54/shop.png"
                    alt="shop"
                  />
                  <h6 className="mb-0 mt-2">{t("hp-app-feature1")}</h6>
                </div>
                <div className="feature">
                  <img
                    width="54"
                    height="54"
                    src="https://img.icons8.com/color/54/gift--v1.png"
                    alt="gift--v1"
                  />
                  <h6 className="mb-0 mt-2">{t("hp-app-feature2")}</h6>
                </div>
              </div>
            </div>
            {/* <div className="col-xs-12 col-lg-6 center">
              <lottie-player
                src="https://assets7.lottiefiles.com/temp/lf20_nXwOJj.json"
                background="transparent"
                speed="1"
                style={{ width: "400px", height: "400px" }}
                loop
                autoplay
              ></lottie-player>
            </div> */}
          </div>
          <div className="row w-100 mt-5">
            <div className="col-xs-12 center">
              <lottie-player
                src="https://assets1.lottiefiles.com/packages/lf20_P4RBQZ.json"
                background="transparent"
                speed="1"
                style={{ width: "80px", height: "80px" }}
                loop
                autoplay
              ></lottie-player>
            </div>
          </div>
        </div>
      </div>
      </div>

      <div className="food-wasting__container app_section">
        <div className="container">
          <div className="row mb-5">
            <div className="col-xs-12 center">
              <h2 className="fw-bold">{t("hp-info-heading")}</h2>
            </div>
          </div>
          <div className="food-wasting__info row mt-4">
            <div className="fw-item col-lg-4">
              <img
                width="94"
                height="94"
                src="https://img.icons8.com/external-flatart-icons-flat-flatarticons/94/external-tree-nature-flatart-icons-flat-flatarticons-1.png"
                alt="external-tree-nature-flatart-icons-flat-flatarticons-1"
              />
              <h4>{t("hp-info-item1-title")}</h4>
              <p>{t("hp-info-item1-text")}</p>
            </div>
            <div className="fw-item col-lg-4">
              <img
                width="94"
                height="94"
                src="https://img.icons8.com/ios/94/sad.png"
                alt="sad"
              />
              <h4>{t("hp-info-item2-title")}</h4>
              <p>{t("hp-info-item2-text")}</p>
            </div>
            <div className="fw-item col-lg-4">
              <img
                width="94"
                height="94"
                src="https://img.icons8.com/fluency/94/money-bag.png"
                alt="money-bag"
              />
              <h4>{t("hp-info-item3-title")}</h4>
              <p>{t("hp-info-item3-text")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-foodgood__container app_section">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-lg-6">
              <lottie-player
                src="https://assets8.lottiefiles.com/private_files/lf30_a4mKwA.json"
                background="transparent"
                speed="1"
                style={{ width: "400px", height: "400px" }}
                loop
                autoplay
              ></lottie-player>
            </div>
            <div className="col-xs-12 col-lg-6 center align-items-start">
              <h1 className="fw-bold mb-3">{t("hp-about-heading")}</h1>
              <p>{t("hp-about-text")}</p>
              <div className="gf-benefits">
                <div className="gf-item">
                  <img
                    width="38"
                    height="38"
                    src="https://img.icons8.com/fluency/38/applause.png"
                    alt="applause"
                  />
                  <h6 className="fw-bold">{t("hp-about-item1")}</h6>
                </div>
                <div className="gf-item">
                  <img
                    width="38"
                    height="38"
                    src="https://img.icons8.com/cotton/38/discount--v1.png"
                    alt="discount--v1"
                  />
                  <h6 className="fw-bold">{t("hp-about-item2")}</h6>
                </div>
                <div className="gf-item">
                  <img
                    width="38"
                    height="38"
                    src="https://img.icons8.com/fluency/38/earth-planet.png"
                    alt="earth-planet"
                  />
                  <h6 className="fw-bold">{t("hp-about-item3")}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
