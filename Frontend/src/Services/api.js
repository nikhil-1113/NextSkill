import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api"
});

export const getCourses = () => API.get("/courses");
export const sendContact = (data) => API.post("/contact", data);
export const registerUser = (data) => API.post("/users/register", data);
export default API;