import { axiosClient } from "./axiosInstance";

export const getMarcasRequest = async () => {
  const response = await axiosClient.get("/marcas");
  return response.data;
};

export const getMarcaRequest = async (id) => {
  const response = await axiosClient.get(`/marcas/${id}`);
  return response.data;
};

export const createMarcasRequest = async (marca) => {
  const response = await axiosClient.post("/marcas", marca);
  return response.data;
};

export const updateMarcasRequest = async (id,marcas) => {
  const response = await axiosClient.put(`/marcas/${id}`,marcas);
  return response.data;
};

export const deleteMarcasRequest = async (id) => {
  const response = await axiosClient.delete(`/marcas/${id}`);
  return response;
};
