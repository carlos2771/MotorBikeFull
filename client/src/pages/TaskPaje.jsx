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

  if (tasks.length === 0) return (
    <div>
      <h1 className="mt-12 text-2xl text-center">Tareas</h1>
      <h1>No hay tareas<br></br><br></br><span className=""><Link to={"/add-task"} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md border">Agregar Tarea</Link></span></h1>
    </div>
  );
  return (
    <div className="mt-16" >
      <div className="flex justify-between">
      <h1 className="text-2xl text-start "><FontAwesomeIcon icon={faTasks} className="mr-2" />Tareas</h1>
      <div className="mx-10 my-1 justify-end">
      <button  className="" title="Agregar">
        <Link to={"/add-task"} className="px-4 py-2 mr-8 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent">
          <FontAwesomeIcon icon={faPlus} />
        </Link>
      </button>
      </div>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {tasks.map((task) => (
          <TaskCard task={task} key={task._id} />
        ))}
      </div>
    </div>
  );
}
