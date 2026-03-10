import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../src/Components/Navbar";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import CourseDetails from "./pages/Coursedetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyCourse from "./pages/Mycourse";
import ProtectedRoute from "./pages/Protect";
import './App.css';

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/mycourse" element={<MyCourse />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          
          <Route path="/courses" element={<CourseDetails />} />
        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;