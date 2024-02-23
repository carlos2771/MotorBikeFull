import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTasks } from '../context/TasksContext'
import { Link, useNavigate, useParams } from 'react-router-dom'
import utc from "dayjs/plugin/utc"
import dayjs from 'dayjs'
import { NombreRequired } from '../utils/validations'
import Swal from "sweetalert2";
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
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Actualizado correctamente",
      });
    }else{
      createTask(dateValid);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Agregado correctamente",
      });
    }
    navigate("/tasks")
  })
  return (
    <div className='flex items-center justify-center pt-20'>
    <div className='bg-slate-700 max-w-md w-full p-10 shadow-lg shadow-blue-600/40'>
    <h1 className="text-2xl flex justify-center mb-5">Agregar tarea </h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="title">Título</label>
        <input 
        type="text" 
        placeholder='Título' 
        {...register("title", NombreRequired)}
        className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
        autoFocus
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        <label htmlFor="description">Descripción</label>
        <textarea 
        rows="3" 
        placeholder='Descripción'
        {...register("description", NombreRequired)}
        className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
        ></textarea>
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}

        
        <label htmlFor="date">Fecha</label>
        <input className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2' type="date"{...register("date")} />
        <div className='justify-end flex mt-6'>
          <button className='px-5 py-1 text-sm text-withe font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 d'>
          Guardar
        </button>
        <button className='px-5 py-1 text-sm text-withe font-semibold  rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ml-3  '>
          <Link to="/tasks">Cancelar</Link>
        </button>
        </div>
      </form>
    </div>
    </div>
  )
}
