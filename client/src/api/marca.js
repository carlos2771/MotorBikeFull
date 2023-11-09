import { axiosClient } from "./axiosInstance";

export const getMarcasRequest = async () => {
  const response = await axiosClient.get("/marcas");
  return response.data;
};

export const getMarcaRequest = async (id) => {
  const response = await axiosClient.get(`/marca/${id}`);
  return response.data;
};

export const createMarcaRequest = async (marcas) => {
  const response = await axiosClient.post("/marca", marcas);
  return response.data;
};

export const updateMarcaRequest = async (id,marcas) => {
  const response = await axiosClient.put(`/marca/${id}`,marcas);
  return response.data;
};

export const deleteMarcaRequest = async (id) => {
  const response = await axiosClient.delete(`/marca/${id}`);
  return response;
};
