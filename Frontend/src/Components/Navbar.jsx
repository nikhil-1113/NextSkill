import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../Assets/logo.png";
import "bootstrap-icons/font/bootstrap-icons.css";
import API from "../Services/api";

function Navbar() {

  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);

  const [messages, setMessages] = useState([]);
  const [showMessages, setShowMessages] = useState(false);

  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

  const user = JSON.parse(sessionStorage.getItem("user"));

  const isAdmin = user?.role === "admin";

  const closeMenu = () => {
    const nav = document.getElementById("navbarNav");
    if (nav && nav.classList.contains("show")) {
      nav.classList.remove("show");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  // Fetch messages for admin
  useEffect(() => {

    if (isAdmin) {

      API.get("/contact")
        .then((res) => {

          console.log("CONTACT API RESPONSE:", res.data);

          // Handle different API response formats
          if (Array.isArray(res.data)) {
            setMessages(res.data);
          } 
          else if (Array.isArray(res.data.data)) {
            setMessages(res.data.data);
          } 
          else {
            setMessages([]);
          }

        })
        .catch((err) => {
          console.log("Message fetch error:", err);
        });

    }

  }, [isAdmin]);

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#37353E",borderRadius:"8px" }}>

      <div className="container">

        <Link className="navbar-brand" to="/">
          <img
            src={logo}
            alt="logo"
            style={{ width: "80px", height: "auto" }}
            
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          style={{ backgroundColor: "white" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">

          <ul className="navbar-nav ms-auto gap-2 align-items-center">

            <li className="nav-item">
              <Link className="btn btn-dark" to="/" onClick={closeMenu}>
                Home
              </Link>
            </li>

            {isLoggedIn && !isAdmin && (
              <li className="nav-item">
                <Link className="btn btn-dark" to="/mycourse" onClick={closeMenu}>
                  My Course
                </Link>
              </li>
            )}

            {isLoggedIn && isAdmin && (
              <li className="nav-item">
                <Link className="btn btn-dark" to="/admin" onClick={closeMenu}>
                  Admin Panel
                </Link>
              </li>
            )}

            {!isLoggedIn && (
              <li className="nav-item">
                <Link className="btn btn-dark" to="/login" onClick={closeMenu}>
                  Login
                </Link>
              </li>
            )}

            {!isLoggedIn && (
              <li className="nav-item">
                <Link className="btn btn-dark" to="/signup" onClick={closeMenu}>
                  Sign Up
                </Link>
              </li>
            )}

            {!isAdmin && (
              <li className="nav-item">
                <Link className="btn btn-dark" to="/contact" onClick={closeMenu}>
                  Contact Us
                </Link>
              </li>
            )}

            {/* ADMIN MESSAGE ICON */}
            {isAdmin && (
              <li className="nav-item position-relative">

                <button
                  className="btn btn-dark"
                  onClick={() => setShowMessages(!showMessages)}
                >
                  <i className="bi bi-envelope fs-6"></i>
                </button>

                {showMessages && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "45px",
                      background: "white",
                      borderRadius: "8px",
                      padding: "10px",
                      width: "300px",
                      maxHeight: "300px",
                      overflowY: "auto",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                      zIndex: 999
                    }}
                  >

                    <h6>User Messages</h6>

                    {messages.length === 0 && (
                      <p>No messages</p>
                    )}

                    {messages.map((msg, index) => (
                      <div key={index} style={{borderBottom:"1px solid #ddd", padding:"5px 0"}}>
                        <strong>{msg.name}</strong>
                        <p style={{margin:0,fontSize:"13px"}}>{msg.email}</p>
                        <p style={{margin:0,fontSize:"13px"}}>{msg.message}</p>
                      </div>
                    ))}

                  </div>
                )}

              </li>
            )}

            {/* PROFILE ICON */}
            {isLoggedIn && (
              <li className="nav-item position-relative">

                <button
                  className="btn btn-dark"
                  onClick={() => setShowProfile(!showProfile)}
                >
                  <i className="bi bi-person-circle fs-6"></i>
                </button>

                {showProfile && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "45px",
                      background: "white",
                      borderRadius: "8px",
                      padding: "10px",
                      width: "200px",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                      zIndex: 999
                    }}
                  >

                    <p style={{ margin: 0, fontWeight: "bold" }}>
                      {user?.name || "User"}
                    </p>

                    <p style={{ margin: 0, fontSize: "13px", color: "gray" }}>
                      {user?.email}
                    </p>

                    <p style={{ margin: "5px 0", fontSize: "13px" }}>
                      Role: {user?.role}
                    </p>

                    <hr style={{ margin: "5px 0" }} />

                    <button
                      className="btn btn-danger btn-sm w-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>

                  </div>
                )}

              </li>
            )}

          </ul>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;