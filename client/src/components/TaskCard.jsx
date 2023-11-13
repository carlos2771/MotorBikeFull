import { Link } from "react-router-dom";
import { useTasks } from "../context/TasksContext"
import utc from "dayjs/plugin/utc"
import dayjs from 'dayjs'
dayjs.extend(utc)


export default function TaskCard({ task }) {
  const {deleteTask} = useTasks()
  return (
    <div className="bg-slate-700 shadow-lg shadow-blue-600/40 max-w-md w-full p-10 rounded-md ">
        <h1 className="flex text-2xl font-bold">{task.title}</h1>  
      <p className="text-slate-300 my-2"> {task.description}</p>
      <p> {dayjs(task.date).utc().format("DD/MM/YYYY")}</p>

      <div className="mt-2">
          <div className="flex gap-x-2 justify-center">
            <button
            className="px-4 py-1 text-sm text-withe font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg "
              onClick={() => {deleteTask(task._id)}}>
              Eliminar
            </button>
            
            <Link 
            className="px-4 py-1 text-sm text-white font-semibold rounded-full border border-green-500  hover:text-white hover:bg-green-600 focus:outline-none focus:ring-2  focus:ring-offset-2 shadow-lg"
            to= {`/tasks/${task._id}`}>Editar</Link>
          </div>
        </div>

    </div>
    
  );
}
