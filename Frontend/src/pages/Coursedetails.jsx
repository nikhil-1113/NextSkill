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

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    API.get(`/courses/${id}`)
      .then(res => {
        setCourse(res.data);
      })
      .catch(err => console.error(err));

    API.post("/enrollments/check", {
      userId: user._id,
      courseId: id
    })
      .then(res => {
        if (res.data.enrolled) {
          setEnrolled(true);
        }
      })
      .catch(err => console.error(err));

  }, [id, navigate]);


  const handleEnroll = async () => {

    const user = JSON.parse(localStorage.getItem("user"));

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


  if (!course)
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border"></div>
      </div>
    );


  const videos = course.videos || [];

  // FIX: videos are strings
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

    <div className="container mt-4 text-white">

      <h2>{course.language}</h2>

      <button
        className="btn btn-success mb-4"
        onClick={handleEnroll}
        disabled={enrolled}
      >
        {enrolled ? "Enrolled" : "Enroll Now"}
      </button>


      <div className="row">

        {/* VIDEO PLAYER */}

        <div className="col-md-8">

          <div className="ratio ratio-16x9 mb-3">

            <iframe
              src={currentVideo.replace("watch?v=", "embed/")}
              title="course-video"
              allowFullScreen
            ></iframe>

          </div>


          <div className="d-flex justify-content-between">

            <button
              className="btn btn-secondary"
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
                : "Mark as Complete"}
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


        {/* VIDEO LIST */}

        <div className="col-md-4">

          <h5>Course Videos</h5>

          <ul className="list-group">

            {videos.map((video, index) => (

              <li
                key={index}
                className={`list-group-item ${index === currentLesson ? "active" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => setCurrentLesson(index)}
              >

                Lesson {index + 1}

                {progress.includes(index) && (
                  <span className="badge bg-success ms-2">✔</span>
                )}

              </li>

            ))}

          </ul>

        </div>

      </div>


      {/* DOCUMENTS */}

      <h4 className="mt-5">Course Documents</h4>

      <div className="d-flex flex-wrap gap-3">

        {course.documents?.map((doc, index) => (

          <a
            key={index}
            href={doc.link}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            {doc.name}
          </a>

        ))}

      </div>

    </div>

  );
}