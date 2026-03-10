import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses } from "../Services/api";

function Home() {

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.language?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    
    <div className="container mt-4 text-white">

      {/* Banner */}

      <div
        className="p-5 mb-4 text-center"
        style={{
          background: "linear-gradient(135deg,#37353E,#4E4A59)",
          borderRadius: "12px"
        }}
      >
        <h1 className="fw-bold">“Empower your future with knowledge.”</h1>

        <p style={{ fontSize: "18px" }}>
          Learn new skills, build real projects, and shape your future.
          Start your journey today and turn knowledge into opportunity.
        </p>

      </div>

      <h2>Available Courses</h2>

      {/* Search Bar */}

      <input
        type="text"
        placeholder="Search courses..."
        className="form-control mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ background: "#D3DAD9", color: "black", border: "2px solid black" }}
      />

      {/* Cards */}

      <div className="row row-cols-1 row-cols-md-4 g-4">

        {filteredCourses.map((course) => (

          <div className="col" key={course.id}>

            <div
              className="card"
              style={{
                width: "18rem",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                backgroundColor: "#BFC9D1"
              }}
            >

              <img
                src={course.image}
                className="card-img-top"
                alt={course.language}
                style={{
                  height: "200px",
                  objectFit: "contain",
                  padding: "20px",
                }}
              />

              <div className="card-body">

                <h5 className="card-title">
                  {course.language}
                </h5>

                <p className="card-text">
                  <b>Instructor:</b> {course.instructor} <br />
                  <b>Duration:</b> {course.duration}
                </p>

                <button
                  className="btn w-100"
                  onClick={() => navigate(`/course/${course.id}`)}
                  style={{ background: "#ffffff", color: "black", border: "2px solid black" }}
                >
                  {course.detailsButton || "View Details"}
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Home;