import { axiosClient } from "./axiosInstance";

export const getPermisosRequest = async () => {
  const response = await axiosClient.get("/permisos");
  return response.data;
};

export const getPermisoRequest = async (id) => {
  const response = await axiosClient.get(`/permisos/${id}`);
  return response.data;
};

export const createPermisosRequest = async (cliente) => {
  const response = await axiosClient.post("/permisos", cliente);
  return response.data;
};

export const updatePermisosRequest = async (id,clientes) => {
  const response = await axiosClient.put(`/permisos/${id}`,clientes);
  return response.data;
};

export const deletePermisosRequest = async (id) => {
  const response = await axiosClient.delete(`/permisos/${id}`);
  return response;
};
