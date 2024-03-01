import { useEffect } from "react";
import { useTasks } from "../context/TasksContext";
import { Link } from "react-router-dom";
import TaskCard from "../components/TaskCard";

import {faLock, faDollarSign, faBan, faInfoCircle, faIdCard,faScrewdriverWrench, faHashtag, faShoppingBag, faPlus, faTasks} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TaskPaje() {
  const { tasks, getTasks } = useTasks();

  useEffect(() => {
    getTasks();
  }, []);

 // Si no hay tareas
if (tasks.length === 0) return (
  <div className="mt-12 text-center">
    <h1 className="text-2xl">Tareas</h1>
    <p className="mt-4">No hay tareas</p>
    <div className="mt-4">
      <Link to={"/add-task"} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md border inline-block">
        Agregar Tarea
      </Link>
    </div>
  </div>
);

// Si hay tareas
return (
  <div className="mt-16">
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl">
        <FontAwesomeIcon icon={faTasks} className="" /> Tareas
      </h1>
      <Link to={"/add-task"} className="px-4 py-2 text-sm text-white font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent">
        <FontAwesomeIcon icon={faPlus} />
      </Link>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {tasks.map((task) => (
        <TaskCard task={task} key={task._id} />
      ))}
    </div>
  </div>
);
}
