const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Enrollment = require("../Models/Enrollment");


/* CHECK ENROLLMENT */

router.post("/check", async (req, res) => {

  try {

    const { userId, courseId } = req.body;

    const enrollment = await Enrollment.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      courseId: new mongoose.Types.ObjectId(courseId)
    });

    res.json({ enrolled: !!enrollment });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });

  }

});


/* GET USER ENROLLMENTS */

router.get("/user/:userId", async (req, res) => {

  try {

    const enrollments = await Enrollment.find({
      userId: new mongoose.Types.ObjectId(req.params.userId)
    }).populate("courseId");

    res.json(enrollments);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });

  }

});


/* ENROLL COURSE */

router.post("/enroll", async (req, res) => {

  try {

    const { userId, courseId } = req.body;

    const existing = await Enrollment.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      courseId: new mongoose.Types.ObjectId(courseId)
    });

    if (existing) {
      return res.json({ alreadyEnrolled: true });
    }

    const enrollment = new Enrollment({
      userId: new mongoose.Types.ObjectId(userId),
      courseId: new mongoose.Types.ObjectId(courseId)
    });

    await enrollment.save();

    res.json({
      success: true,
      message: "Course enrolled successfully"
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });

  }

});


module.exports = router;