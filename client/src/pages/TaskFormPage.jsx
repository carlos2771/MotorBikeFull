import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTasks } from '../context/TasksContext'
import { useNavigate, useParams } from 'react-router-dom'
import utc from "dayjs/plugin/utc"
import dayjs from 'dayjs'
import { NombreRequired } from '../utils/validations'
dayjs.extend(utc)
//dayjs es para modificar la fecha a tipo string

export default function TaskFormPage() {
  const {register, handleSubmit, setValue, formState: {errors} } = useForm() 
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
    <div className='flex items-center justify-center pt-20'>
    <div className='bg-slate-700 max-w-md w-full p-10 shadow-lg shadow-blue-600/40'>
    <h1 className="text-2xl flex justify-center mb-5">Agregar tarea </h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="title">Titulo</label>
        <input 
        type="text" 
        placeholder='Titulo' 
        {...register("title", NombreRequired)}
        className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
        autoFocus
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        <label htmlFor="description">Descripcion</label>
        <textarea 
        rows="3" 
        placeholder='Descripcion'
        {...register("description", NombreRequired)}
        className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
        ></textarea>
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        <label htmlFor="date">Date</label>
        <input className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2' type="date"{...register("date")} />
        <div className='justify-end flex mt-6'>
          <button className='bg-blue-600 px-3 py-2 rounded-md  '>
          Guardar
        </button>
        </div>
      </form>
    </div>
    </div>
  )
}
