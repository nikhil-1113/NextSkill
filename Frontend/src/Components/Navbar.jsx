import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../Assets/logo.png";

function Navbar() {

  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: "#37353E" }}
    >
      <div className="container">

        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img
            src={logo}
            alt="logo"
            style={{ width: "80px", height: "60px" }}
          />
        </Link>

        {/* Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          style={{ backgroundColor: "white" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">

          <ul className="navbar-nav ms-auto gap-2">

            <li className="nav-item">
              <Link className="btn btn-dark" to="/">
                Home
              </Link>
            </li>

            {isLoggedIn && (
              <li className="nav-item">
                <Link className="btn btn-dark" to="/mycourse">
                  My Course
                </Link>
              </li>
            )}

            {!isLoggedIn && (
              <li className="nav-item">
                <Link className="btn btn-dark" to="/login">
                  Login
                </Link>
              </li>
            )}

            {!isLoggedIn && (
              <li className="nav-item">
                <Link className="btn btn-dark" to="/signup">
                  Sign Up
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link className="btn btn-dark" to="/contact">
                Contact Us
              </Link>
            </li>

            {isLoggedIn && (
              <li className="nav-item">
                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}

          </ul>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;