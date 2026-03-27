require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const enrollmentRoutes = require("./Routes/Enrollment");
const courseRoutes = require("./Routes/Course");
const userRoutes = require("./Routes/User");
const contactRoutes = require("./Routes/Contact");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ✅ DB Connection
connectDB();

// ✅ Test Route (for debugging)
app.get("/test", (req, res) => {
  res.send("Server is working ✅");
});

// ✅ Routes
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);   // IMPORTANT
app.use("/api/enrollments", enrollmentRoutes);

// ✅ Server Start
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});