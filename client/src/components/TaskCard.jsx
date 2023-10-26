import { Link } from "react-router-dom";
import { useTasks } from "../context/TasksContext"
import utc from "dayjs/plugin/utc"
import dayjs from 'dayjs'
dayjs.extend(utc)


export default function TaskCard({ task }) {
  const {deleteTask} = useTasks()
  return (
    <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
      <header className="flex justify-between">
        <h1 className="text-2xl font-bold">{task.title}</h1>
        <div className="flex gap-x-2 items-center">
          <button
          className="px-4 py-1 text-sm text-withe font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent   "
            onClick={() => {
              deleteTask(task._id)
            }}
          >
            delete
          </button>
          
          <Link 
          className="px-4 py-1 text-sm text-white font-semibold rounded-full border border-green-500  hover:text-white hover:bg-green-600 focus:outline-none focus:ring-2  focus:ring-offset-2"
          to= {`/tasks/${task._id}`}>Editar</Link>
        </div>
      </header>
      <p className="text-slate-300"> {task.description}</p>
      <p> {dayjs(task.date).utc().format("DD/MM/YYYY")}</p>
    </div>
  );
}
