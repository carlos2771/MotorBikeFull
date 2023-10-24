import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTasks } from '../context/TasksContext'
import { useNavigate, useParams } from 'react-router-dom'

export default function TaskFormPage() {
  const {register, handleSubmit, setValue } = useForm() 
  const {createTask, getTask, updateTask} = useTasks()
  const navigate = useNavigate()
  const params = useParams()

  useEffect(()=>{
    async function loadTask (){
      if(params.id){ // lo que capture de params de tasks lo va traer a este formulario
        const task = await getTask(params.id) // para ver los datos de una tarea especifica desde todas las tareas
        console.log(task);
        setValue("title",task.title)
        setValue("description",task.description)
      }
    }
    loadTask()
  }, [])

  const onSubmit = handleSubmit((data)=>{
    if(params.id){
      updateTask(params.id, data)
    }else{
      createTask(data);
    }
    navigate("/tasks")
  })
  return (
    <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md'>
      <form onSubmit={onSubmit}>
        <input 
        type="text" 
        placeholder='Title' 
        {...register("title")}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        autoFocus
        />
        <textarea 
        rows="3" 
        placeholder='Descripcion'
        {...register("description")}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        ></textarea>
        <button>
          Guardar
        </button>
      </form>
    </div>
  )
}
