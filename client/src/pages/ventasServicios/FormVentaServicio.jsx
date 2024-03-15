import React, { useEffect, useState } from "react";
import { useVentasServicios } from "../../context/VentasServicioContex";
import { Link, useNavigate, useParams, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useClientes } from "../../context/ClientContext";
import { useMecanicos } from "../../context/MecanicosContext";
import {
  NegativeRequired,
  ClienteRequired,
  MecanicoRequired,
  descripcionValidators,
  placaValidators,
} from "../../utils/validations";
import Swal from "sweetalert2";
import { useAuth } from "../../hooks/useAuth";

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
  const [formTitle, setFormTitle] = useState("Agregar Venta Servicio");

  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      if (params.id) {
        setFormTitle("Editar Venta Servicio");
        const ventaServicio = await getVentaServicio(params.id);
        setValue("mecanico", ventaServicio.mecanico);
        setValue("cliente", ventaServicio.cliente);
        setValue("precio_servicio", ventaServicio.precio_servicio);
        setValue("descripcion", ventaServicio.descripcion);
        setValue("placa", ventaServicio.placa);
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
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
        color: "white",
        timer: 4000,
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
      if (res) navigate("/ventas-servicios");
    } else {
      const transformData = {
        ...data,
        precio_servicio: Number(data.precio_servicio),
        estado: "En proceso",
      };
      const res = await createVentaServicio(transformData);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
        color: "white",
        timer: 4000,
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
      if (res) navigate("/ventas-servicios");
      else {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
          color: "white",
          timer: 4000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "error",
          title: "No se ha agregado",
        });
      }
    }
  });
  
  const permissions = user?.rol?.permissions || [];

  return (
    <>
      {permissions.includes("Ventas Servicio") ? (
        <div className="flex items-center justify-center pt-20">
          <div className="bg-slate-700 max-w-md w-full p-10 shadow-lg shadow-blue-600/40">
            {ventasServiciosErrors?.map((error, i) => (
              <div className="bg-red-500 p-2 text-white" key={i}>
                {error}
              </div>
            ))}
            <h1 className="text-2xl flex justify-center ">
            {formTitle}{" "}
            </h1>
            <form className="mt-10" onSubmit={onSubmit}>
              <label>
                Cliente<span className="text-red-500">*</span>
              </label>
              <select
                {...register("cliente", ClienteRequired)}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2 my-2"
              >
                <option value="">Selecciona un cliente</option>
                {clientes
                  .filter((cliente) => cliente.estado === "Activo")
                  .map((cliente) => (
                    <option key={cliente._id} value={cliente._id}>
                      {cliente.nombre_cliente}
                    </option>
                  ))}
              </select>
              {errors.cliente && (
                <p className="text-red-500">{errors.cliente.message}</p>
              )}

              <label>
                Mecánico<span className="text-red-500">*</span>
              </label>
              <select
                {...register("mecanico", MecanicoRequired)}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2 my-2"
              >
                <option value="">Selecciona un mecánico</option>
                {mecanicos
                  .filter((mecanico) => mecanico.estado === "Activo")
                  .map((mecanico) => (
                    <option key={mecanico._id} value={mecanico._id}>
                      {mecanico.nombre_mecanico}
                    </option>
                  ))}
              </select>
              {errors.mecanico && (
                <p className="text-red-500">{errors.mecanico.message}</p>
              )}

              <label>
                Placa de vehículo<span className="text-red-500">*</span>
              </label>
              <input
                placeholder="Ingresa la placa"
                {...register("placa", placaValidators)}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2 my-2"
              />
              {errors.placa && (
                <p className="text-red-500">{errors.placa.message}</p>
              )}

              <label>
                Precio del servicio<span className="text-red-500">*</span>
              </label>
              <input
                placeholder="Ingresa el precio"
                type="number"
                {...register("precio_servicio", NegativeRequired)}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2 my-2"
              />
              {errors.precio_servicio && (
                <p className="text-red-500">{errors.precio_servicio.message}</p>
              )}

              <label>
                Descripción<span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Ingresa una descripción"
                {...register("descripcion", descripcionValidators)}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2 my-2"
              />
              {errors.descripcion && (
                <p className="text-red-500">{errors.descripcion.message}</p>
              )}
            <div className="flex items-center justify-center mt-2">
              <button
                className="px-5 py-1 text-sm text-withe font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 "
                type="submit"
              >
                Guardar
              </button>
              <button>
                <Link to="/ventas-servicios" className="px-5 py-1 ml-2 text-sm text-withe font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30">Cancelar</Link>
              </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <Navigate to="/tasks" />
      )}
    </>
  );
}
