import React from 'react';
import "./DashboardNav.css";
import { Link } from 'react-router-dom';

import { useAuth } from '../../hooks/auth-hook';

export default function DashboardNav() {

    const { user } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg bg-light dashboard-nav">
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" aria-current="page" to="/">
                    Home
                  </Link>
                </li>
                {user?.role === 'user' && <li className="nav-item">
                  <Link className="nav-link" aria-current="page" to="/stores">
                    Stores
                  </Link>
                </li>}
                <li className="nav-item">
                  <Link className="nav-link" aria-current="page" to="/about-us">
                    About Us
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" aria-current="page" to="/contact-us">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
  )
}
