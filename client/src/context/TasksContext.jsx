import { useContext, useState, createContext } from "react";
import {
  createTasksRequest,
  deleteTasksRequest,
  getTaskRequest,
  getTasksRequest,
  updateTasksRequest,
} from "../api/tasks";

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks debe ser usado en TaskProvider");
  return context;
};
export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  const getTasks = async () => {
    try {
      const res = await getTasksRequest();
      setTasks(res);
    } catch (error) {
      console.error("error de ob", error);
    }
  };
  const createTask = async (task) => {
    const res = await createTasksRequest(task);
  };

  const getTask = async (id) => {
    try {
      const res = await getTaskRequest(id);
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const updateTask = async (id, task) => {
    try {
      await updateTasksRequest(id, task);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await deleteTasksRequest(id);
      if (res.status === 204) setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        getTasks,
        createTask,
        updateTask,
        deleteTask,
        getTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
