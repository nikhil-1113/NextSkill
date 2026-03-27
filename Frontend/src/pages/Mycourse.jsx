import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Services/api";

function MyCourses() {
  console.log("MyCourses component rendered");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {

    const userData = sessionStorage.getItem("user");

    if (!userData) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userData);

    fetchMyCourses(user._id);

  }, [navigate]);


  const fetchMyCourses = async (userId) => {

    try {

      const res = await API.get(`/enrollments/user/${userId}`);

      console.log("Enrollments:", res.data);

      // Extract course object safely
      const enrolledCourses = res.data
        .map((enroll) => enroll.courseId)
        .filter((course) => course && course._id);

      console.log("Courses:", enrolledCourses);

      setCourses(enrolledCourses);

    } catch (error) {

      console.error("Error fetching courses:", error);

    } finally {

      setLoading(false);

    }

  };


  if (loading) {
    return <h3 className="text-center mt-5">Loading courses...</h3>;
  }


  return (

    <div className="container mt-4 ">

      <h2>My Courses</h2>

      <p>Courses you enrolled for...</p>

      {courses.length === 0 ? (

        <p>No enrolled courses yet.</p>

      ) : (

        <div className="row row-cols-1 row-cols-md-4 g-4">

          {courses.map((course) => (

            <div className="col" key={course._id}>

              <div
                className="card shadow"
                style={{ backgroundColor: "#BFC9D1" }}
              >

                <img
                  src={course.image}
                  className="card-img-top img-fluid"
                  alt={course.language}
                  style={{
                    height: "200px",
                    objectFit: "contain",
                    padding: "20px"
                  }}
                />

                <div className="card-body">

                  <h5>{course.language}</h5>

                  <p>
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
                    Continue Learning
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );
}

export default MyCourses;