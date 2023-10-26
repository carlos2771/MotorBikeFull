import { axiosClient } from "./axiosInstance";

export const getClientesRequest = async () => {
  const response = await axiosClient.get("/clientes");
  return response.data;
};

export const getClienteRequest = async (id) => {
  const response = await axiosClient.get(`/clientes/${id}`);
  return response.data;
};

export const createClientesRequest = async (cliente) => {
  const response = await axiosClient.post("/clientes", cliente);
  return response.data;
};

export const updateClientesRequest = async (id,clientes) => {
  const response = await axiosClient.put(`/clientes/${id}`,clientes);
  return response.data;
};

export const deleteClientesRequest = async (id) => {
  const response = await axiosClient.delete(`/clientes/${id}`);
  return response;
};
