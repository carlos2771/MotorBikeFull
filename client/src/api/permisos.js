import { axiosClient } from "./axiosInstance";

export const getPermisosRequest = async () => {
  const response = await axiosClient.get("/permisos");
  return response.data;
};

export const getPermisoRequest = async (id) => {
  const response = await axiosClient.get(`/permisos/${id}`);
  return response.data;
};

export const createPermisosRequest = async (permisos) => {
  const response = await axiosClient.post("/permisos", permisos);
  return response.data;
};

export const updatePermisosRequest = async (id,permisos) => {
  const response = await axiosClient.put(`/permisos/${id}`,permisos);
  return response.data;
};

export const deletePermisosRequest = async (id) => {
  const response = await axiosClient.delete(`/permisos/${id}`);
  return response;
};
