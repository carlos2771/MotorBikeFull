import { useEffect } from "react";
import { useTasks } from "../context/TasksContext";
import { Link } from "react-router-dom";
import TaskCard from "../components/TaskCard";

export default function TaskPaje() {
  const { tasks, getTasks } = useTasks();

  useEffect(() => {
    getTasks();
  }, []);

  if (tasks.length === 0) return <h1>No hay tareas</h1>;
  return (
    <div className="my-20 mx-16 ">
      <div className="justify-end flex my-1">
      <button className="px-3   m-2 text-sm text-withe font-semibold rounded-full border border-blue-500 hover:text-white hover:bg-blue-500 hover:border-transparent shadow-lg ">
        <Link to={"/add-task"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </Link>
      </button>

      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {tasks.map((task) => (
          <TaskCard task={task} key={task._id} />
        ))}
      </div>
    </div>
  );
}
