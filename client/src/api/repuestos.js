import { axiosClient } from "./axiosInstance";

export const getRepuestosRequest = async () => {
  const response = await axiosClient.get("/repuestos");
  return response.data;
};

export const getRepuestoRequest = async (id) => {
  const response = await axiosClient.get(`/repuestos/${id}`);
  return response.data;
};

export const createRepuestosRequest = async (cliente) => {
  const response = await axiosClient.post("/repuestos", cliente);
  return response.data;
};

export const updateRepuestosRequest = async (id,clientes) => {
  const response = await axiosClient.put(`/repuestos/${id}`,clientes);
  return response.data;
};

export const deleteRepuestosRequest = async (id) => {
  const response = await axiosClient.delete(`/repuestos/${id}`);
  return response;
};
