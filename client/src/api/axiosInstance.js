import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api"

const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // para poder leer las cookies
  
})

export {axiosClient}