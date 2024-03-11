import { axiosClient } from "./axiosInstance";

export const getRolesRequest = async () => {
    const response = await axiosClient.get('/rol');
    return response.data;
  };
  
  export const getRolRequest = async (id) => {
    const response = await axiosClient.get(`/rol/${id}`);
    return response.data;
  };
  
  export const createRolRequest = async (roles) => {
    const response = await axiosClient.post('/rol', roles);
    return response.data;
  };
  
  export const updateRolRequest = async (id, roles) => {
    const response = await axiosClient.put(`/rol/${id}`, roles);
    return response.data;
  };
  
  export const deleteRolRequest = async (id) => {
    const response = await axiosClient.delete(`/rol/${id}`);
    return response;
  };