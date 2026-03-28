import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../Services/api";

export default function Signup() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const newUser = {
      name: formData.name,
      email: formData.email.toLowerCase(),
      password: formData.password
    };

    try {

      await registerUser(newUser);

      alert("Registration Successful");

      navigate("/login");

    } catch (error) {

      console.error(error);
      alert("Registration Failed");

    }

  };

  return (

    <div className="container mt-3 mt-md-5">

      <div className="row justify-content-center">

        <div className="col-12 col-sm-10 col-md-5">

          <div 
            className="card shadow w-100" 
            style={{ borderRadius: "0px", maxWidth: "500px", margin: "auto" }}
          >

            <div className="card-body" style={{ backgroundColor: '#BFC9D1' }}>

              <h3 className="text-center mb-4">Register</h3>

              <form onSubmit={handleSubmit}>

                <input
                  className="form-control mb-3"
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

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

                <input
                  className="form-control mb-3"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <button
                  className="btn btn-dark w-100"
                  style={{ background: '#ffffff', color: 'black', border: '2px solid black' }}
                >
                  Register
                </button>

              </form>

              <p className="text-center mt-3">
                Already have an account? <Link to="/login">Login</Link>
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}
