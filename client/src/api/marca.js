import { axiosMarca } from "./axiosInstance";

export const getMarcasRequest = async () => {
  const response = await axiosMarca.get("/marcas");
  return response.data;
};

export const getMarcaRequest = async (id) => {
  const response = await axiosMarca.get(`/marca/${id}`);
  return response.data;
};

export const createMarcaRequest = async (marcas) => {
  const response = await axiosMarca.post("/marca", marcas);
  return response.data;
};

export const updateMarcaRequest = async (id,marcas) => {
  const response = await axiosMarca.put(`/marca/${id}`,marcas);
  return response.data;
};

export const deleteMarcaRequest = async (id) => {
  const response = await axiosMarca.delete(`/marca/${id}`);
  return response;
};
