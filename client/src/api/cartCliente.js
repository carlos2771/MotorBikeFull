import { axiosClient } from "./axiosInstance";

export const getCartClientesRequest = async () => {
    const response = await axiosClient.get("/cart-cliente");
    return response.data;
  };

export const createCartClienteRequest = async (data) => {
    const response = await axiosClient.post("/cart-cliente", data);
    return response.data;
  };