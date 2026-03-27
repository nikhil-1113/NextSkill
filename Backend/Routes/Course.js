const express = require("express");
const router = express.Router();
const Course = require("../Models/Course");


/* ---------------- GET ALL COURSES ---------------- */

router.get("/", async (req, res) => {

  try {

    const courses = await Course.find();

    const formattedCourses = courses.map(course => ({
      _id: course._id,
      language: course.language,
      description: course.description,        // ✅ FIXED: was missing
      instructor: course.instructor,
      duration: course.duration,
      image: course.image,
      detailsButton: course.detailsButton,
      videos: course.videos || [],
      documents: course.documents || []
    }));

    res.json(formattedCourses);

  } catch (error) {

    console.error("Fetch courses error:", error);
    res.status(500).json({ error: error.message });

  }

});


/* ---------------- GET SINGLE COURSE ---------------- */

router.get("/:id", async (req, res) => {

  try {

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);

  } catch (error) {

    console.error("Fetch course error:", error);
    res.status(500).json({ error: error.message });

  }

});


/* ---------------- CREATE COURSE ---------------- */

router.post("/", async (req, res) => {

  try {

    const newCourse = new Course({
      language: req.body.language,
      description: req.body.description,      // ✅ FIXED: was missing
      instructor: req.body.instructor,
      duration: req.body.duration,
      image: req.body.image,
      detailsButton: req.body.detailsButton
    });

    const savedCourse = await newCourse.save();

    res.status(201).json(savedCourse);

  } catch (error) {

    console.error("Create course error:", error);
    res.status(500).json({ error: error.message });

  }

});


/* ---------------- UPDATE COURSE ---------------- */

router.put("/:id", async (req, res) => {

  try {

    const updateData = {};

    // Only include fields that are provided
    if (req.body.language !== undefined) updateData.language = req.body.language;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.instructor !== undefined) updateData.instructor = req.body.instructor;
    if (req.body.duration !== undefined) updateData.duration = req.body.duration;

    // Handle image separately - if image is empty string, remove it from database
    if (req.body.image !== undefined) {
      if (req.body.image === "" || req.body.image === null) {
        // Use $unset to remove the image field completely
        const updatedCourse = await Course.findByIdAndUpdate(
          req.params.id,
          { $unset: { image: 1 } },
          { returnDocument: 'after' }
        );
        res.json(updatedCourse);
        return;
      } else {
        updateData.image = req.body.image;
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: 'after' }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(updatedCourse);

  } catch (error) {

    console.error("Update course error:", error);
    res.status(500).json({ error: error.message });

  }

});


/* ---------------- DELETE COURSE ---------------- */

router.delete("/:id", async (req, res) => {

  try {

    const deletedCourse = await Course.findByIdAndDelete(req.params.id);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course deleted successfully" });

  } catch (error) {

    console.error("Delete course error:", error);
    res.status(500).json({ error: error.message });

  }

});


/* ---------------- VIDEO ROUTES ---------------- */


/* ADD VIDEO */

router.post("/:id/videos", async (req, res) => {

  try {

    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "Video URL required" });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.videos.push(url);

    await course.save();

    res.json(course);

  } catch (error) {

    console.error("Add video error:", error);
    res.status(500).json({ error: error.message });

  }

});


/* DELETE VIDEO */

router.delete("/:id/videos/:index", async (req, res) => {

  try {

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const index = req.params.index;

    if (index >= course.videos.length) {
      return res.status(400).json({ message: "Video index invalid" });
    }

    course.videos.splice(index, 1);

    await course.save();

    res.json(course);

  } catch (error) {

    console.error("Delete video error:", error);
    res.status(500).json({ error: error.message });

  }

});


/* ---------------- DOCUMENT ROUTES ---------------- */


/* ADD DOCUMENT */

router.post("/:id/documents", async (req, res) => {

  try {

    const { name, link } = req.body;

    if (!name || !link) {
      return res.status(400).json({ message: "Document name and link required" });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.documents.push({
      name: name,
      link: link
    });

    await course.save();

    res.json(course);

  } catch (error) {

    console.error("Add document error:", error);
    res.status(500).json({ error: error.message });

  }

});


/* DELETE DOCUMENT */

router.delete("/:id/documents/:index", async (req, res) => {

  try {

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const index = req.params.index;

    if (index >= course.documents.length) {
      return res.status(400).json({ message: "Document index invalid" });
    }

    course.documents.splice(index, 1);

    await course.save();

    res.json(course);

  } catch (error) {

    console.error("Delete document error:", error);
    res.status(500).json({ error: error.message });

  }

});


module.exports = router;