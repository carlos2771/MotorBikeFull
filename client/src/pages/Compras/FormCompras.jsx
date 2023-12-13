import React, { useEffect, useState } from "react";
import { useCompras } from "../../context/ComprasContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import utc from "dayjs/plugin/utc";
import dayjs from 'dayjs';
dayjs.extend(utc);

import { useForm, useFieldArray } from "react-hook-form";
import { useRepuestos } from "../../context/RepuestosContext";
import { NegativeRequired, RepuestoRequired, fecha } from "../../utils/validations";
const currentYear = dayjs().year();

export default function FormCompra() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: {
      repuestos: [{ repuesto: "", cantidad_repuesto: "", precio_unitario: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "repuestos",
  });

  const {
    createCompra,
    errors: comprasErrors,
  } = useCompras();
  const { repuestos, getRepuestos } = useRepuestos();
  const navigate = useNavigate();

  const [selectedRepuesto, setSelectedRepuesto] = useState("");
  const [repuestosList, setRepuestosList] = useState([]);

  useEffect(() => {
    try {
      getRepuestos();
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    if (!data.fecha) {
      data.fecha = dayjs().format("YYYY-MM-DD");
    }

    const repuestoData = {
      repuesto: repuestos.find((repuesto) => repuesto._id === data.repuestos[0].repuesto),
      cantidad_repuesto: data.repuestos[0].cantidad_repuesto,
      precio_unitario: data.repuestos[0].precio_unitario,
      precio_total: data.repuestos[0].cantidad_repuesto * data.repuestos[0].precio_unitario,
    };

    setRepuestosList([...repuestosList, repuestoData]);

    reset();
  });

  const guardarCompra = async () => {
    const compraData = {
      fecha: dayjs().format("YYYY-MM-DD"),
      repuestos: repuestosList.map((repuesto) => ({
        repuesto: repuesto.repuesto,
        cantidad_repuesto: repuesto.cantidad_repuesto,
        precio_unitario: repuesto.precio_unitario,
        precio_total: repuesto.cantidad_repuesto * repuesto.precio_unitario,
      })),
    };

    try {
      await createCompra(compraData);
      reset();
      navigate("/compras");
    } catch (error) {
      console.error("Error al crear la compra:", error);
    }
  };

  return (
    <div className="flex items-center justify-center pt-20">
      <div className="bg-slate-700 p-10 shadow-lg shadow-blue-600/40" style={{ width: '1000px' }}>
        {comprasErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
        <h1 className="text-2xl flex justify-center ">Agregar Compra </h1>
        <form className="mt-10" onSubmit={onSubmit}>
        <label>Repuestos</label>
          <div className="flex">
          {fields.map((item, index) => (
            <div key={item.id} className="my-2">
              <select
                style={{ width: '220px' }}
                {...register(`repuestos.${index}.repuesto`, RepuestoRequired)}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2 my-2"
                onChange={(e) => setSelectedRepuesto(e.target.value)}
              >
                <option value="">Selecciona un repuesto</option>
                {repuestos.map((repuesto) => (
                  <option
                    key={repuesto._id}
                    value={repuesto._id}
                    disabled={repuesto._id === selectedRepuesto}
                  >
                    {repuesto.nombre_repuesto}
                  </option>
                ))}
              </select>

              {errors.repuestos && errors.repuestos[index] && errors.repuestos[index].repuesto && errors.repuestos[index].repuesto.message && (
                <p className="text-red-500">{errors.repuestos[index].repuesto.message}</p>
              )}

             

              <input style={{ width: '220px' }}
                placeholder="Cantidad"
                {...register(`repuestos.${index}.cantidad_repuesto`, NegativeRequired)}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2 m-2"
              />
              {errors.repuestos && errors.repuestos[index] && errors.repuestos[index].cantidad_repuesto && (
                <p className="text-red-500">{errors.repuestos[index].cantidad_repuesto.message}</p>
              )}


              <input style={{ width: '220px' }}
                placeholder="Precio unitario"
                {...register(`repuestos.${index}.precio_unitario`, RepuestoRequired)}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2 my-2"
              />
              {errors.repuestos && errors.repuestos[index] && errors.repuestos[index].precio_unitario && (
                <p className="text-red-500">{errors.repuestos[index].precio_unitario.message}</p>
              )}

              <input style={{ width: '220px' }}
            type="date"
            className="w-full ml-2 bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2 my-2"
            {...register("fecha", { min: `${currentYear}-01-01`, max: `${currentYear}-12-31` }, fecha)}
          />

          <button type="submit" className="mx-2">Agregar</button>
          <button type="button" onClick={() => remove(index)}>Eliminar</button>
          
            </div>
          ))}
          

          </div>
          
          <div className="">
          <h2 className="text-xl font-semibold mt-4">Repuestos Agregados:</h2>
          <ul>
            {repuestosList.map((repuesto, index) => (
              <li key={index}>
                {repuesto.repuesto.nombre_repuesto} - Cantidad: {repuesto.cantidad_repuesto}, Precio Unitario: {repuesto.precio_unitario}
              </li>
            ))}
          </ul>

         
          </div>

          
          <br />

          
        </form>
        <div className="flex">
        <button
          className="px-5 py-1 text-sm text-withe font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 d"
          onClick={guardarCompra}>Guardar
        </button>
        <button>
            <Link className="px-5 py-1 text-sm text-withe font-semibold  rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ml-5  " to="/compras">Cancelar</Link>
          </button>
       
        </div>
        
      </div>
    </div>
  );
}
