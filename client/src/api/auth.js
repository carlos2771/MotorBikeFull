import { axiosClient } from "./axiosInstance";

export const registerRequest = async (user) =>  {
 const res = await axiosClient.post('/register', user)
 return res.data
}

export const loginRequest = async (user) => {
    const res = await axiosClient.post("/login", user)
    return res.data 
    
}

export const verifyTokenRequest= async() => {
    const res = await axiosClient.get("/verify")
    return res.data
}
// export const logoutRequest= async() => {
//     const res = await axiosClient.get("verify")
//     return res.data
// }




