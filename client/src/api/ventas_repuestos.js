import { axiosClient } from "./axiosInstance";

export const getVentasRepuestosRequest = async () => {
  const response = await axiosClient.get("/ventas_repuestos");
  return response.data;
};

export const getVentaRepuestoRequest = async (id) => {
  const response = await axiosClient.get(`/ventas_repuestos/${id}`);
  return response.data;
};

export const createVentasRepuestosRequest = async (cliente) => {
  const response = await axiosClient.post("/ventas_repuestos", cliente);
  return response.data;
};

export const updateVentasRepuestosRequest = async (id,clientes) => {
  const response = await axiosClient.put(`/ventas_repuestos/${id}`,clientes);
  return response.data;
};

export const deleteVentasRepuestosRequest = async (id) => {
  const response = await axiosClient.delete(`/ventas_repuestos/${id}`);
  return response;
};
