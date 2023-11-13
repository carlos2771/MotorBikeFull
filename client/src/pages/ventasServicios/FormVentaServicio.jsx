import React, { useEffect, useState } from "react";
import { useVentasServicios } from "../../context/VentasServicioContex";
import { Link,useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useClientes } from "../../context/ClientContext";
import { useMecanicos } from "../../context/MecanicosContext";
import { NegativeRequired, NombreRequired } from "../../utils/validations";

export default function FormVentaServicio() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const {
    createVentaServicio,
    getVentaServicio,
    updateVentaServicio,
    errors: ventasServiciosErrors,
  } = useVentasServicios();
  const { clientes, getClientes } = useClientes();
  const { mecanicos, getMecanicos } = useMecanicos();
  const navigate = useNavigate();
  const params = useParams();
  
  useEffect(() => {
    (async () => {
      if (params.id) {
        const ventaServicio = await getVentaServicio(params.id);
        setValue("mecanico", ventaServicio.mecanico);
        setValue("cliente", ventaServicio.cliente);
        setValue("precio_servicio", ventaServicio.precio_servicio);
        setValue("descripcion", ventaServicio.descripcion);
      }
    })();
  }, []);

  useEffect(() => {
    try {
      getClientes();
      getMecanicos();
    } catch (error) {
      console.error("Error al obtener clientes y mecánicos:", error);
    }
  }, []);

 
const onSubmit = handleSubmit(async (data) => {
  
    if (params.id) {
      const res = updateVentaServicio(params.id, data);
      if (res) navigate("/ventas-servicios");
    } else {
      const transformData={
        ...data,
        precio_servicio: Number(data.precio_servicio)///AQUI CONVIERTO EL STRING DE PRECIO A UN TIPO NUMBER PARA QUE NO ME DE ERROR
      }
      console.log(typeof(data.precio_servicio))/// AQUI MIRO QUE TIPO DE DATO ES PRECIO_SERVICIO
      const res = await createVentaServicio(transformData);//AQUI TRASFORMO LOS DATOS Y LOS GUARDO EN TRANSFORM
      if (res) navigate("/ventas-servicios");
    }
  });

  console.log(ventasServiciosErrors);

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
       <div className="bg-slate-700 max-w-md w-full p-10 shadow-lg shadow-blue-600/40">
        {ventasServiciosErrors?.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
        <h1 className="text-2xl flex justify-center ">Agregar Venta servicio </h1>
        <form className="mt-10" onSubmit={onSubmit}>
          <label>Cliente</label>
          <select
            {...register("cliente", NombreRequired)}
            className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
          >
            <option value="">Selecciona un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente._id} value={cliente._id}>
                {cliente.nombre_cliente}
              </option>
            ))}
          </select>          
          
          <label>Mecánico</label>
          { <select
            {...register("mecanico", NombreRequired)}
            className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
          >
            <option value="">Selecciona un mecánico</option>
            {mecanicos.map((mecanico) => (
              <option key={mecanico._id} value={mecanico._id}>
                {mecanico.nombre_mecanico}
              </option>
            ))}
          </select> }
           {errors.mecanico && <p className="text-red-500">{errors.mecanico.message}</p>}
          <label>Precio del Servicio</label>
          <input
            type="number"
            {...register("precio_servicio", NegativeRequired)}
            className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
          />
          {errors.precio_servicio && <p className="text-red-500">{errors.precio_servicio.message}</p>}
          <label>Descripción</label>
          <textarea
            {...register("descripcion", NombreRequired)}
            className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
          />
          {errors.descripcion && <p className="text-red-500">{errors.descripcion.message}</p>}
          <label>Estado</label>
          <select
        {...register("estado")}
        className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
        >
          <option value={"Activo"} >
            Activo
          </option>
          <option value={"Inactivo"} >
            Inactivo
          </option>

        </select>
           {errors.cliente && <p className="text-red-500">{errors.cliente.message}</p>}
        <button className='px-5 py-1 text-sm text-withe font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ' type="submit">
          Guardar
        </button>
        <button className='px-5 py-1 text-sm text-withe font-semibold  rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ml-5  '>
          <Link to="/ventas-servicios">Cancelar</Link>
        </button>
        </form>
      </div>
    </div>
  );
}