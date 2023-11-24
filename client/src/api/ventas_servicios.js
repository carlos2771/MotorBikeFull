import { axiosClient } from "./axiosInstance";

export const getVentasServiciosRequest = async (startDate, endDate) => {
  let url = "/ventas_servicios";

  if (startDate && endDate) {
    url += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
  }

  const response = await axiosClient.get(url);
  return response.data;
};

export const getVentaServicioRequest = async (id) => {
  const response = await axiosClient.get(`/ventas_servicios/${id}`);
  return response.data;
};

export const createVentasServiciosRequest = async (servicio) => {
  const response = await axiosClient.post("/ventas_servicios", servicio);
  return response.data;
};

export const updateVentasServiciosRequest = async (id, servicios) => {
  const response = await axiosClient.put(`/ventas_servicios/${id}`, servicios);
  return response.data;
};

export const deleteVentasServiciosRequest = async (id) => {
  const response = await axiosClient.delete(`/ventas_servicios/${id}`);
  return response;
};
