import { axiosClient } from "./axiosInstance";

export const getComprasRequest = async () => {
    const response = await axiosClient.get("/compras");
    return response.data;
};

export const getCompraRequest = async (id) => {
    const response = await axiosClient.get(`/compras/${id}`);
    return response.data;
};

export const createComprasRequest = async (compras) => {
    const response = await axiosClient.post("/compras", compras);
    return response.data;
};

export const updateComprasRequest = async (id, compras) => {
    const response = await axiosClient.put(`/compras/${id}`, compras);
    return response.data;
};

export const deleteComprasRequest = async (id) => {
    const response = await axiosClient.delete(`/compras/${id}`);
    return response;
};
