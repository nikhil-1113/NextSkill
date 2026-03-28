import React, { useEffect, useState, useRef } from "react";
import API from "../Services/api";

export default function AdminDashboard() {

  const [courses, setCourses] = useState([]);
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [instructor, setInstructor] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [editId, setEditId] = useState(null);
  const fileInputRef = useRef(null);

  const [videoUrl, setVideoUrl] = useState("");
  const [docName, setDocName] = useState("");
  const [docLink, setDocLink] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

   const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first");
      window.location.href = "/login";
      return;
    }

    

    fetchCourses();

  }, []);

  const fetchCourses = async () => {

    try {

      const res = await API.get("/courses");
      setCourses(res.data || []);

    } catch (error) {

      console.error("Fetch courses error:", error);

    }

  };


  // Compress + convert image to base64 before sending
  const handleImageChange = (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {

      const img = new Image();
      img.src = reader.result;

      img.onload = () => {

        const canvas = document.createElement("canvas");

        // Resize to max 800px wide
        const maxWidth = 800;
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Compress to 70% quality JPEG — keeps payload well under 1mb
        const compressed = canvas.toDataURL("image/jpeg", 0.7);

        setImage(compressed);
        setImagePreview(compressed);

      };

    };

    reader.readAsDataURL(file);

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editId) {

        await API.put(`/courses/${editId}`, {
          language,
          description,
          duration,
          instructor,
          image
        });

        // Re-fetch and repopulate form so all fields stay visible after update
        const res = await API.get(`/courses/${editId}`);
        const data = res.data;

        setSelectedCourse(data);
        setLanguage(data.language || "");
        setDescription(data.description || "");
        setDuration(data.duration || "");
        setInstructor(data.instructor || "");
        setImage(data.image || "");
        setImagePreview(data.image || "");
        
        // Clear the file input after successful update
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        
        alert("Course updated successfully!");

      } else {

        await API.post("/courses", {
          language,
          description,
          duration,
          instructor,
          image
        });

        // Only clear on create
        setLanguage("");
        setDescription("");
        setDuration("");
        setInstructor("");
        setImage("");
        setImagePreview("");
        setEditId(null);
        
        // Clear the file input after successful create
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        
        alert("Course created successfully!");

      }

      fetchCourses();
      scrollTop(); 

    } catch (error) {

      console.error("Create/Update error:", error);
      alert("Failed to save course. Please try again.");

    }

  };

  const deleteCourse = async (id) => {

    if (!id) return;

    const confirmDelete = window.confirm("Delete this course?");
    if (!confirmDelete) return;

    try {

      await API.delete(`/courses/${id}`);
      fetchCourses();
      setSelectedCourse(null);
      setEditId(null);
      setLanguage("");
      setDescription("");
      setDuration("");
      setInstructor("");
      setImage("");
      setImagePreview("");
      
      // Clear the file input after deletion
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      alert("Course deleted successfully!");
      scrollTop(); 

    } catch (error) {

      console.error("Delete error:", error);
      alert("Failed to delete course");

    }

  };

  const manageCourse = async (course) => {

    try {

      const res = await API.get(`/courses/${course._id}`);
      const data = res.data;

      setSelectedCourse(data);
      setLanguage(data.language || "");
      setDescription(data.description || "");
      setDuration(data.duration || "");
      setInstructor(data.instructor || "");
      setImage(data.image || "");
      setImagePreview(data.image || "");
      setEditId(data._id);
      
      // Clear the file input when switching to edit mode
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Bring the form back into view when selecting a course to manage
      scrollTop();

    } catch (error) {

      console.error("Manage course error:", error);

    }

  };

  const addVideo = async () => {

    if (!videoUrl || !editId) return;

    try {

      await API.post(`/courses/${editId}/videos`, { url: videoUrl });
      setVideoUrl("");
      manageCourse({ _id: editId });

    } catch (error) {

      console.error("Add video error:", error);

    }

  };

  const deleteVideo = async (index) => {

    if (!editId) return;

    try {

      await API.delete(`/courses/${editId}/videos/${index}`);
      manageCourse({ _id: editId });

    } catch (error) {

      console.error("Delete video error:", error);

    }

  };

  const addDocument = async () => {

    if (!docName || !docLink || !editId) return;

    try {

      await API.post(`/courses/${editId}/documents`, {
        name: docName,
        link: docLink
      });

      setDocName("");
      setDocLink("");
      manageCourse({ _id: editId });

    } catch (error) {

      console.error("Add document error:", error);

    }

  };

  const deleteDocument = async (index) => {

    if (!editId) return;

    try {

      await API.delete(`/courses/${editId}/documents/${index}`);
      manageCourse({ _id: editId });

    } catch (error) {

      console.error("Delete document error:", error);

    }

  };


  return (

    <div className="container mt-4"
      style={{ background: "#4E4A59", padding: "30px", borderRadius: "10px" }}>

      <h2 className="text-center mb-4"
        style={{ color: "#fff", fontWeight: "bold" }}>
        Admin Dashboard
      </h2>

      {/* CREATE / UPDATE SECTION */}

      <div className="card shadow mb-4"
        style={{ background: "#BFC9D1" }}>

        <div className="card-header"
          style={{ background: "#37353E", color: "#fff" }}>
          {editId ? "Update & Manage Course" : "Create Course"}
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit} className="row g-3">

            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Instructor"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <button
                className="btn w-100"
                style={{ background: "#C9A64A", color: "#fff" }}
              >
                {editId ? "Update Course" : "Create Course"}
              </button>
            </div>

            <div className="col-12">
              <textarea
                className="form-control"
                placeholder="Course Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* IMAGE UPLOAD */}

            <div className="col-12">

              <label className="form-label fw-bold">Course Image</label>

              <input
                ref={fileInputRef}
                className="form-control"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              {/* IMAGE PREVIEW */}

              {imagePreview && (
                <div className="mt-3">

                  <img
                    src={imagePreview}
                    alt="Course Preview"
                    style={{
                      width: "200px",
                      height: "130px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "2px solid #C9A64A",
                      display: "block",
                      marginBottom: "10px"
                    }}
                  />

                </div>
              )}

            </div>

          </form>

          {/* VIDEO MANAGEMENT */}

          {editId && (

            <>

              <hr />

              <h5>Add Video</h5>

              <div className="input-group mb-3">

                <input
                  className="form-control"
                  placeholder="YouTube Embed URL"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />

                <button className="btn btn-success" onClick={addVideo}>
                  Add
                </button>

              </div>

              <div className="row">

                {selectedCourse?.videos?.map((video, index) => (

                  <div className="col-md-4 mb-3" key={index}>

                    <div className="card">

                      <iframe
                        height="200"
                        src={video}
                        title="video"
                        allowFullScreen
                      />

                      <div className="card-body text-center">

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteVideo(index)}
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

              <h5 className="mt-4">Add Document</h5>

              <div className="input-group mb-3">

                <input
                  className="form-control"
                  placeholder="Document Name"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                />

                <input
                  className="form-control"
                  placeholder="Document Link"
                  value={docLink}
                  onChange={(e) => setDocLink(e.target.value)}
                />

                <button className="btn btn-success" onClick={addDocument}>
                  Add
                </button>

              </div>

              <ul className="list-group">

                {selectedCourse?.documents?.map((doc, index) => (

                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between"
                  >

                    <a href={doc.link} target="_blank" rel="noreferrer">
                      {doc.name}
                    </a>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteDocument(index)}
                    >
                      Delete
                    </button>

                  </li>

                ))}

              </ul>

            </>

          )}

        </div>

      </div>

      {/* COURSE TABLE */}

      <div className="card shadow"
        style={{ background: "#BFC9D1" }}>

        <div className="card-header"
          style={{ background: "#37353E", color: "#fff" }}>
          Courses
        </div>

        <div className="card-body">

          <table className="table table-bordered align-middle">

            <thead>
              <tr>
                <th>Image</th>
                <th>Language</th>
                <th>Instructor</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {courses.map((course) => (

                <tr key={course._id}>

                  <td>
                    {course.image ? (
                      <img
                        src={course.image}
                        alt={course.language}
                        style={{
                          width: "70px",
                          height: "45px",
                          objectFit: "cover",
                          borderRadius: "6px"
                        }}
                      />
                    ) : (
                      <span className="text-muted" style={{ fontSize: "12px" }}>
                        No image
                      </span>
                    )}
                  </td>

                  <td>{course.language}</td>
                  <td>{course.instructor}</td>
                  <td>{course.duration}</td>

                  <td>

                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => manageCourse(course)}
                    >
                      Manage
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteCourse(course._id)}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}
