import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:3001/api/users/login",
        formData
      );

      if (res.data.success) {

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(res.data.user));

        alert("Login Successful");

        navigate("/");

      } else {

        alert("Invalid Email or Password");

      }

    } catch (error) {

      console.error(error);
      alert("Login Failed");

    }

  };

  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-5">

          <div className="card shadow" style={{ width: "500px", borderRadius: "0px" }}>

            <div className="card-body" style={{ backgroundColor:'#BFC9D1' }}>

              <h3 className="text-center mb-4">Login</h3>

              <form onSubmit={handleSubmit}>

                <input
                  className="form-control mb-3"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <input
                  className="form-control mb-3"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  className="btn w-100"
                  style={{background:'#ffffff',color:'black',border:'2px solid black'}}
                >
                  Login
                </button>

              </form>

              <p className="text-center mt-3">
                Don't have an account? <Link to="/signup">Register</Link>
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}