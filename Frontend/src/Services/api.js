import axios from "axios";

const API = axios.create({
  baseURL: "https://nextskill-backend.onrender.com/api"
});

export const getCourses = () => API.get("/courses");
export const loginUser = (data) => API.post("/users/login", data);
export const sendContact = (data) => API.post("/contact", data);
export const registerUser = (data) => API.post("/users/register", data);
export default API;
