import React, { useState } from "react";
import { sendContact } from "../Services/api";

function Contact() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
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

      await sendContact(formData);

      alert("Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        message: ""
      });

    } catch (error) {

      console.error(error);
      alert("Failed to send message");

    }

  };

  return (

    <div className="container mt-5 d-flex justify-content-center">

      <div className="card shadow-lg" style={{ width: "500px", borderRadius: "0px" }}>

        <div className="card-body" style={{backgroundColor:'#BFC9D1'}}>

          <h3 className="card-title text-center mb-4">Contact Us</h3>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">

              <label className="form-label">Name</label>

              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>

            <div className="mb-3">

              <label className="form-label">Email</label>

              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>

            <div className="mb-3">

              <label className="form-label">Message</label>

              <textarea
                className="form-control"
                rows="4"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>

            </div>

            <button
              className="btn w-100"
              style={{background:'#ffffff',color:'black',border:'2px solid black'}}
            >
              Send Message
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Contact;