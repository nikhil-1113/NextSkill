import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../Services/api";

export default function CourseDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [progress, setProgress] = useState([]);

  useEffect(() => {

    const isLoggedIn = sessionStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(sessionStorage.getItem("user"));

    API.get(`/courses/${id}`)
      .then(res => setCourse(res.data))
      .catch(err => console.error(err));

    API.post("/enrollments/check", {
      userId: user._id,
      courseId: id
    })
      .then(res => {
        if (res.data.enrolled) setEnrolled(true);
      })
      .catch(err => console.error(err));

  }, [id, navigate]);


  const handleEnroll = async () => {

    const user = JSON.parse(sessionStorage.getItem("user"));

    try {

      const res = await API.post("/enrollments/enroll", {
        userId: user._id,
        courseId: id
      });

      if (res.data.alreadyEnrolled) {
        alert("You already enrolled in this course!");
        setEnrolled(true);
        return;
      }

      setEnrolled(true);
      alert(`You successfully enrolled in ${course.language} course!`);

    } catch (error) {
      console.error(error);
    }

  };


  if (!course) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  const videos = course.videos || [];
  const currentVideo = videos[currentLesson] || "";

  const handleNext = () => {
    if (currentLesson + 1 < videos.length) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const handleBack = () => {
    if (currentLesson - 1 >= 0) {
      setCurrentLesson(currentLesson - 1);
    }
  };

  const handleComplete = () => {
    if (!progress.includes(currentLesson)) {
      setProgress([...progress, currentLesson]);
    }
  };


  return (

    <div className="container mt-4">

      {/* COURSE HEADER */}

      <div className="card shadow mb-4">

        <div
          className="card-body text-center"
          style={{
            background: "linear-gradient(135deg,#37353E,#4E4A59)",
            color: "white"
          }}
        >

          <h2 className="fw-bold">{course.language}</h2>

          {/* DESCRIPTION ADDED HERE */}

          <p
            style={{
              maxWidth: "750px",
              margin: "12px auto",
              fontSize: "16px",
              opacity: "0.9"
            }}
          >
            {course.description ||
              "This course will help you learn the fundamentals and practical skills required to master this technology through structured lessons and real examples."}
          </p>

          <button
            className="btn btn-success mt-2"
            onClick={handleEnroll}
            disabled={enrolled}
          >
            {enrolled ? "Enrolled" : "Enroll Now"}
          </button>

        </div>

      </div>


      <div className="row">

        {/* VIDEO PLAYER */}

        <div className="col-lg-8 mb-4">

          <div className="card shadow">

            <div className="card-body">

              <div className="ratio ratio-16x9 mb-3">

                <iframe
                  src={currentVideo.replace("watch?v=", "embed/")}
                  title="course-video"
                  allowFullScreen
                ></iframe>

              </div>


              {/* VIDEO CONTROLS */}

              <div className="d-flex justify-content-between">

                <button
                  className="btn btn-outline-secondary"
                  onClick={handleBack}
                  disabled={currentLesson === 0}
                >
                  Back
                </button>

                <button
                  className="btn btn-success"
                  onClick={handleComplete}
                  disabled={progress.includes(currentLesson)}
                >
                  {progress.includes(currentLesson)
                    ? "Completed"
                    : "Mark Complete"}
                </button>

                <button
                  className="btn btn-primary"
                  onClick={handleNext}
                  disabled={currentLesson + 1 >= videos.length}
                >
                  Next
                </button>

              </div>

            </div>

          </div>

        </div>


        {/* LESSON LIST */}

        <div className="col-lg-4">

          <div className="card shadow">

            <div className="card-header bg-dark text-white">
              Course Lessons
            </div>

            <ul className="list-group list-group-flush">

              {videos.map((video, index) => (

                <li
                  key={index}
                  className={`list-group-item d-flex justify-content-between align-items-center 
                  ${index === currentLesson ? "active" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setCurrentLesson(index)}
                >

                  Lesson {index + 1}

                  {progress.includes(index) && (
                    <span className="badge bg-success">Done</span>
                  )}

                </li>

              ))}

            </ul>

          </div>

        </div>

      </div>


      {/* DOCUMENTS */}

      <div className="card shadow mt-4">

        <div className="card-header bg-dark text-white">
          Course Documents
        </div>

        <div className="card-body">

          <div className="d-flex flex-wrap gap-3">

            {course.documents?.map((doc, index) => (

              <a
                key={index}
                href={doc.link}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-primary"
              >
                {doc.name}
              </a>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}