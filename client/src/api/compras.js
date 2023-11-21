import { axiosClient } from "./axiosInstance";

export const getComprasRequest = async () => {
  const response = await axiosClient.get("/compras");
  return response.data;
};

export const getCompraRequest = async (id) => {
  const response = await axiosClient.get(`/compras/${id}`);
  return response.data;
};

// CAMBIAR POR SI ALGO => CLIENTE A COMPRA
export const createComprasRequest = async (compra) => {
  const response = await axiosClient.post("/compras", compra);
  return response.data;
};

export const updateComprasRequest = async (id, compra) => {
  const response = await axiosClient.put(`/compras/${id}`, compra);
  return response.data;
};

export const deleteComprasRequest = async (id) => {
  const response = await axiosClient.delete(`/compras/${id}`);
  return response;
};
