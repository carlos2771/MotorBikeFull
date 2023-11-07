import axios from "axios"; //Realizar solicitudes HTTP

const BASE_URL = import.meta.env.VITE_BASE_URL //Variable de entorno que almacena la URL de la base a la que se realizarán las solicitudes HTTP

//Creación de instancias de Axios
const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, //Para poder leer las cookies
  
})

const axiosMecanico = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // para poder leer las cookies
  
})

const axiosMarca = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // para poder leer las cookies
  
})

//Exportación de las instancias de Axios
export {axiosClient, axiosMecanico, axiosMarca}