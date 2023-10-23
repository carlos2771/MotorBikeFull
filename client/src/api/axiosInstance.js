import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // para poder leer las cookies
  
})

export {axiosClient}