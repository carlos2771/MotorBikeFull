import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL

const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // para poder leer las cookies
  
})

export {axiosClient}