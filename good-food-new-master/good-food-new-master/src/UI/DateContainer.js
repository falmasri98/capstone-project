import React from "react";
import "./DateContainer.css";

import moment from "moment";

export default function DateContainer() {
  let date = moment().format("MMMM Do YYYY, h:mm:ss a");

  return (
    <div className="Date-container">
      <small className="date text-muted">{date}</small>
    </div>
  );
}
