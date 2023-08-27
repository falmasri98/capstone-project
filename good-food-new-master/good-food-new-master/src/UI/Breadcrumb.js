import React from "react";
import { Link } from "react-router-dom";

export default function Breadcrumb({ prev, current }) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to={`/${prev}`} className="text-light">
            {prev === "" ? "Home" : prev}
          </Link>
        </li>
        <li className="breadcrumb-item active text-light" aria-current="page">
          {current}
        </li>
      </ol>
    </nav>
  );
}
