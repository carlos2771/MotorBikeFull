import { axiosClient } from "./axiosInstance";

export const getMecanicosRequest = async () => {
  const response = await axiosClient.get("/mecanicos");
  return response.data;
};

export const getMecanicoRequest = async (id) => {
  const response = await axiosClient.get(`/mecanicos/${id}`);
  return response.data;
};

export const createMecanicosRequest = async (mecanico) => {
  const response = await axiosClient.post("/mecanicos", mecanico);
  return response.data;
};

export const updateMecanicosRequest = async (id, mecanico) => {
  const response = await axiosClient.put(`/mecanicos/${id}`, mecanico);
  return response.data;
};

export const deleteMecanicosRequest = async (id) => {
  const response = await axiosClient.delete(`/mecanicos/${id}`);
  return response;
};