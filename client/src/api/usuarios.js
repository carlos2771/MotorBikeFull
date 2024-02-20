import { axiosClient } from "./axiosInstance";

export const getUsuariosRequest = async () => {
    const response = await axiosClient.get('/usuarios');
    return response.data;
  };
  
  export const getUsuarioRequest = async (id) => {
    const response = await axiosClient.get(`/usuarios/${id}`);
    return response.data;
  };
  
  export const createUsuarioRequest = async (usuario) => {
    const response = await axiosClient.post('/usuarios', usuario);
    return response.data;
  };
  
  export const updateUsuarioRequest = async (id, usuario) => {
    const response = await axiosClient.put(`/usuarios/${id}`, usuario);
    return response.data;
  };

  export const deleteUsuarioRequest = async (id) => {
    const response = await axiosClient.delete(`/usuarios/${id}`);
    return response;
  };