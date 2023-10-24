import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL

const axiosClient = axios.create({
<<<<<<< Updated upstream
  baseURL: "http://localhost:3000/api",
=======
  baseURL: "http://localhost:3000/api/",
>>>>>>> Stashed changes
  withCredentials: true, // para poder leer las cookies
  
})

export {axiosClient}