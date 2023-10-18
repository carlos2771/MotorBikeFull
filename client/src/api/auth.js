import { axiosClient } from "./axiosInstance";

export const registerRequest = async (user) =>  {
 const res = await axiosClient.post('/api/register', user)
 return res.data
}

export const loginRequest = async (user) => {
    const res = await axiosClient.post("/api/login", user)
    return res.data 
    
}

export const verifyTokentRequet = async() => {
    const res = await axiosClient.get("/api/verify")
    return res.data
}


