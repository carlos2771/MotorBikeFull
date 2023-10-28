import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTasks } from '../context/TasksContext'
import { useNavigate, useParams } from 'react-router-dom'
import utc from "dayjs/plugin/utc"
import dayjs from 'dayjs'
dayjs.extend(utc)
//dayjs es para modificar la fecha a tipo string

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
        
        setValue("date", dayjs(task.date).utc().format("YYYY-MM-DD"))
      }
    }
    loadTask()
  }, [])

  const onSubmit = handleSubmit((data)=>{

    const dateValid = {
      ...data,
      date: data.date ? dayjs.utc(data.date).format() : dayjs.utc().format() // si no ingresa ninguna fecha se crea con la fecha actual
    } 
    if(params.id){
      updateTask(params.id, dateValid)
    }else{
      createTask(dateValid);
    }
    navigate("/tasks")
  })
  return (
    <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
    <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md'>
      <form onSubmit={onSubmit}>
        <label htmlFor="title">Titulo</label>
        <input 
        type="text" 
        placeholder='Titulo' 
        {...register("title")}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        autoFocus
        />
        <label htmlFor="description">Descripcion</label>
        <textarea 
        rows="3" 
        placeholder='Descripcion'
        {...register("description")}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        ></textarea>
        <label htmlFor="date">Date</label>
        <input className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2' type="date"{...register("date")} />
        <button className='bg-indigo-500 px-3 py-2 rounded-md'>
          Guardar
        </button>
      </form>
    </div>
    </div>
  )
}
