import { axiosClient } from "./axiosInstance";

export const registerRequest = async (user) =>  {
 const res = await axiosClient.post('/register', user)
 return res.data
}




