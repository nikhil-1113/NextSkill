require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const enrollmentRoutes = require("./Routes/Enrollment");
const courseRoutes = require("./Routes/Course");
const userRoutes = require("./Routes/User");
const contactRoutes = require("./Routes/Contact");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// database connection
connectDB();

// routes
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/enrollments", enrollmentRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});