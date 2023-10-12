import axios from "axios";
const API = "http://localhost:3000/api" // backend
export const registerRequest = user =>  axios.post(`${API}/register`, user).then(function (response) {
    console.log(response);
    return response //Retornarsdf
  })
  .catch(function (error) {
    console.log(error);
  }
  )

