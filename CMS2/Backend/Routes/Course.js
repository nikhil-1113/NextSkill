const express = require("express");
const router = express.Router();
const Course = require("../Models/Course");

// GET all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();

    const formattedCourses = courses.map(course => ({
      id: course._id,
      language: course.language,
      instructor: course.instructor,
      duration: course.duration,
      image: course.image,
      detailsButton: course.detailsButton
    }));

    res.json(formattedCourses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.json(course);
});
// ADD course
router.post("/", async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    const savedCourse = await newCourse.save();
    res.json(savedCourse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;