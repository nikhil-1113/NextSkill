const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  detailsButton: {
    type: String,
    default: "View Details"
  }
});

module.exports = mongoose.model("Course", CourseSchema); 