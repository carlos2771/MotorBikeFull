import { axiosClient } from "./axiosInstance";

export const getRepuestosTablaRequests = async () => {
    const response = await axiosClient.get("/tabla_servicio");
    return response.data;
};

export const createRepuestoTablaRequests = async (repuesto) => {
    const response = await axiosClient.post("/tabla_servicio", repuesto);
    return response.data;
};

export const updateRepuestoTablaRequests = async (
    id,
    query,
    cantidad_repuesto
) => {
    if (query === "del" && cantidad_repuesto === 1) {
        const response = await axiosClient.delete(`/tabla_servicio/${id}`);
        return response.data;
    } else {
        const response = await axiosClient.put(
            `/tabla_servicio/${id}?query=${query}`
        );
        return response.data;
    }
};

//   export const deleteRepuestoTabla = async (id) => {
//     const response = await axiosClient.delete(`/tabla_servicio/${id}`);
//     return response;
//   };