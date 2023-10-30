import { axiosClient } from "./axiosInstance";

export const getrRepuestosRequest = async () => {
    const response = await axiosClient.get("/repuestos");
    return response.data;
  };