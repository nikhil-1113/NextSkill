const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({

  language: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: "This course provides structured lessons, practical examples, and learning resources to help you master the programming language."
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
  },

  // VIDEOS
  videos: {
    type: [String],
    default: []
  },

  // DOCUMENTS
  documents: [
    {
      name: String,
      link: String
    }
  ]

});

module.exports = mongoose.model("Course", CourseSchema);