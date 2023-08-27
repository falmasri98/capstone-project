import React, { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

import { AuthContext } from "../context/auth-context";
import { useAuth } from "../hooks/auth-hook";

const ADMIN_ROUTES = (
  <ul className="menu-links">
    <li className="nav-link">
      <Link to="/admin/dashboard/home">
        <i className="bx bx-home-alt icon"></i>
        <span className="text nav-text">Dashboard</span>
      </Link>
    </li>

    <li className="nav-link">
      <Link to="/admin/dashboard/add-new-user">
        <i className="bx bx-plus-circle icon"></i>
        <span className="text nav-text">Add User</span>
      </Link>
    </li>

    <li className="nav-link">
      <Link to="/admin/dashboard/add-new-admin">
        <i className="bx bx-user-plus icon"></i>
        <span className="text nav-text">Add New Admin</span>
      </Link>
    </li>

    <li className="nav-link">
      <Link to="/admin/dashboard/deleted-accounts">
        <i className="bx bx-list-ul icon"></i>
        <span className="text nav-text">Deleted Accounts</span>
      </Link>
    </li>

    <li className="nav-link">
      <Link to="/admin/dashboard/edit-content">
        <i className="bx bx-edit icon"></i>
        <span className="text nav-text">Edit Content</span>
      </Link>
    </li>

    <li className="nav-link">
      <Link to="/admin/dashboard/all-services">
        <i className="bx bx-shopping-bag icon"></i>
        <span className="text nav-text">All Services</span>
      </Link>
    </li>

    <li className="nav-link">
      <Link to="/admin/dashboard/users-messages">
        <i className="bx bx-chat icon"></i>
        <span className="text nav-text">Users Messages</span>
      </Link>
    </li>
  </ul>
);

const PROVIDER_ROUTES = (
  <ul className="menu-links">
    <li className="nav-link">
      <Link to="/provider/dashboard/home">
        <i className="bx bx-home-alt icon"></i>
        <span className="text nav-text">Dashboard</span>
      </Link>
    </li>
    <li className="nav-link">
      <Link to="/provider/dashboard/services">
        <i className="bx bx-list-ul icon"></i>
        <span className="text nav-text">My Services</span>
      </Link>
    </li>
    <li className="nav-link">
      <Link to="/provider/dashboard/orders">
        <i className="bx bxs-package icon"></i>
        <span className="text nav-text">My Orders</span>
      </Link>
    </li>
    <li className="nav-link">
      <Link to="/provider/dashboard/profile">
        <i className="bx bx-user-circle icon"></i>
        <span className="text nav-text">Profile</span>
      </Link>
    </li>
  </ul>
);

const USER_ROUTES = (
  <ul className="menu-links">
    <li className="nav-link">
      <Link to="/user/dashboard/home">
        <i className="bx bxs-package icon"></i>
        <span className="text nav-text">My Orders</span>
      </Link>
    </li>
    <li className="nav-link">
      <Link to="/user/dashboard/profile">
        <i className="bx bx-user-circle icon"></i>
        <span className="text nav-text">Profile</span>
      </Link>
    </li>
  </ul>
);

export default function Sidebar({ isSubscribed }) {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { user } = useAuth();

  // useEffect(() => {
  //   const body = document?.querySelector("body");
  //   let modeSwitch = body.querySelector(".toggle-switch");
  //   let modeText = body.querySelector(".mode-text");

  //   modeSwitch.addEventListener("click", () => {
  //     body.classList.toggle("dark");

  //     if (body.classList.contains("dark")) {
  //       modeText.innerText = "Light mode";
  //     } else {
  //       modeText.innerText = "Dark mode";
  //     }
  //   });
  // }, []);

  const logout = () => {
    auth.logout();
    navigate("/");
  };

  const toggleSidebar = () => {
    const body = document?.querySelector("body");
    let sidebar = body?.querySelector(".sidebar");

    sidebar.classList.toggle("close");
  };

  return (
    <nav className="sidebar close">
      <header>
        <div className="image-text">
          <span className="image">
            {user?.role === "admin" && (
              <lottie-player
                src="https://assets6.lottiefiles.com/packages/lf20_a91d7Z.json"
                background="transparent"
                speed="1"
                style={{ width: "100px", height: "100px" }}
                autoplay
              ></lottie-player>
            )}
            {user?.role !== "admin" && (
              <lottie-player
                src="https://assets9.lottiefiles.com/packages/lf20_myor1trh.json"
                background="transparent"
                speed="1"
                style={{ width: "100px", height: "100px" }}
                autoplay
              ></lottie-player>
            )}
          </span>

          <div className="text logo-text">
            <span className="name">Good Food</span>
            <span className="profession">Saving food App</span>
          </div>
        </div>

        <i className="bx bx-chevron-right toggle" onClick={toggleSidebar}></i>
      </header>

      <div className="menu-bar">
        {user?.role === "provider" && isSubscribed === true && (
          <div className="menu">
            <li className="search-box">
              <i className="bx bx-search icon"></i>
              <input type="text" placeholder="Search..." />
            </li>

            {user?.role === "provider" && PROVIDER_ROUTES}
          </div>
        )}

        {user?.role === "user" && (
          <div className="menu">
            <li className="search-box">
              <i className="bx bx-search icon"></i>
              <input type="text" placeholder="Search..." />
            </li>

            {user?.role === "user" && USER_ROUTES}
          </div>
        )}

        {user?.role === "admin" && (
          <div className="menu">
            <li className="search-box">
              <i className="bx bx-search icon"></i>
              <input type="text" placeholder="Search..." />
            </li>
            {user?.role == "admin" && ADMIN_ROUTES}
          </div>
        )}

        <div className="bottom-content">
          <li className="" onClick={logout}>
            <i className="bx bx-log-out icon"></i>
            <span className="text nav-text">Logout</span>
          </li>

          <li className="mode">
            <div className="sun-moon">
              <i className="bx bx-moon icon moon"></i>
              <i className="bx bx-sun icon sun"></i>
            </div>
            <span className="mode-text text">Dark mode</span>

            <div className="toggle-switch">
              <span className="switch"></span>
            </div>
          </li>
        </div>
      </div>
    </nav>
  );
}
