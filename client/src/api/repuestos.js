import { axiosClient } from "./axiosInstance";

export const getRepuestosRequest = async () => {
  const response = await axiosClient.get("/repuestos");
  return response.data;
};

export const getRepuestoRequest = async (id) => {
  const response = await axiosClient.get(`/repuestos/${id}`);
  return response.data;
};

export const createRepuestoRequest = async (repuesto) => {
  const response = await axiosClient.post("/repuestos", repuesto);
  return response.data;
};

export const updateRepuestoRequest = async (id,repuestos) => {
  const response = await axiosClient.put(`/repuestos/${id}`,repuestos);
  return response.data;
};

export const deleteRepuestoRequest = async (id) => {
  const response = await axiosClient.delete(`/repuestos/${id}`);
  return response;
};
