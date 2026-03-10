/*import React, { useEffect, useState } from "react";
import { getCourses } from "../Services/api";
import { useNavigate } from "react-router-dom";

function Coursecard() {

  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  return (
    <div className="row row-cols-1 row-cols-md-4 g-4">

      {courses.length === 0 ? (
        <p className="text-center">No courses available</p>
      ) : (
        courses.map((course) => (

          <div className="col" key={course._id}>

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
                  padding: "20px"
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
                  onClick={() => navigate(`/course/${course._id}`)}
                  style={{
                    background: "#ffffff",
                    color: "black",
                    border: "2px solid black"
                  }}
                >
                  {course.detailsButton || "View Details"}
                </button>

              </div>

            </div>

          </div>

        ))
      )}

    </div>
  );
}

export default Coursecard;*/