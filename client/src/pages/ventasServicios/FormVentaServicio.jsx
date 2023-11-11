import React, { useEffect, useState } from "react";
import { useVentasServicios } from "../../context/VentasServicioContex";
import { useNavigate, useParams } from "react-router-dom";
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
  const [selectedServicio, setselectedServicio] = useState(null);
  
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
      if (res) navigate("/ventas_servicios");
    } else {
      const res = await createVentaServicio(data);
      if (res) navigate("/ventas_servicios");
    }
  });

  console.log(ventasServiciosErrors);

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
        {ventasServiciosErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
        <form onSubmit={onSubmit}>
          <label>Cliente</label>
          <select
            {...register("cliente", NombreRequired)}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          >
            <option value="">Selecciona un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente._id} value={cliente._id}>
                {cliente.nombre_cliente}
              </option>
            ))}
          </select>
          {errors.cliente && <p className="text-red-500">{errors.cliente.message}</p>}
          <label>Mecánico</label>
          <select
            {...register("mecanico", NombreRequired)}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          >
            <option value="">Selecciona un mecánico</option>
            {mecanicos.map((mecanico) => (
              <option key={mecanico._id} value={mecanico._id}>
                {mecanico.nombre_mecanico}
              </option>
            ))}
          </select>
          {errors.mecanico && <p className="text-red-500">{errors.mecanico.message}</p>}
          <label>Precio del Servicio</label>
          <input
            type="number"
            {...register("precio_servicio", NegativeRequired)}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          />
          {errors.precio_servicio && <p className="text-red-500">{errors.precio_servicio.message}</p>}
          <label>Descripción</label>
          <textarea
            {...register("descripcion", NombreRequired)}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          />
          {errors.descripcion && <p className="text-red-500">{errors.descripcion.message}</p>}
          <button
            className="px-5 py-1 text-sm text-withe font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 d"
            type="submit"
          >
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}