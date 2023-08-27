import React from "react";
import "./DashboardTitle.css";

import DashboardNav from "../components/DashboardNav/DashboardNav";
import DateContainer from "./DateContainer";

export default function DashboardTitle(props) {
  return (
    <div className="title-wrapper" data-aos="fade-right">
      <h3>Welcome back, {props.name}</h3>
      <div className="d-flex align-items-center justify-content-center gap-5">
        <DashboardNav />
        <DateContainer />
      </div>
    </div>
  );
}
