import React from "react";
import "./SurpriseBag.css";

export default function SurpriseBag({
  service_id,
  service_type,
  service_category,
  provider_id,
  status,
}) {
  return (
    <div className="card surprise-bag__item" style={{ width: "18rem" }}>
      <img
        src="https://img.icons8.com/color/48/gift--v1.png"
        className="card-img-top"
        alt="gift--v1"
      />
      <div className="card-body">
        <h5 className="card-title text-capitalize fw-bold">{service_type}</h5>
        <p className="card-text">
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </p>
        <div className="service-status">
          status: {status}
        </div>
      </div>
    </div>
  );
}
