import { axiosClient } from "./axiosInstance";

export const getTasksRequest = async () => {
  const response = await axiosClient.get("/tasks");
  return response.data;
};

export const getTaskRequest = async (id) => {
  const response = await axiosClient.get(`/tasks/${id}`);
  return response.data;
};

export const createTasksRequest = async (task) => {
  const response = await axiosClient.post("/tasks", task);
  return response.data;
};

export const updateTasksRequest = async (id, task) => {
  const response = await axiosClient.put(`/tasks/${id}`, task);
  return response.data;
};

export const deleteTasksRequest = async (id) => {
  const response = await axiosClient.delete(`/tasks/${id}`);
  return response;
};
