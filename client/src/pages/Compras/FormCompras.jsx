import React, { useEffect, useState } from "react";
import { useCompras } from "../../context/ComprasContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import utc from "dayjs/plugin/utc"
import dayjs from 'dayjs'
dayjs.extend(utc)

import { useForm } from "react-hook-form";
import { useRepuestos } from "../../context/RepuestosContext";
import { NegativeRequired, NombreRequired, RepuestoRequired, fecha} from "../../utils/validations";


const currentYear = dayjs().year();

export default function FormCompra() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const {
    createCompra,
    getCompra,
    updateCompra,
    errors: comprasErrors,
  } = useCompras();
  const { repuestos, getRepuestos } = useRepuestos();
  const navigate = useNavigate();
  const params = useParams();
  const [selectedRepuesto, setSelectedRepuesto] = useState();

  useEffect(() => {
    (async () => {
      if (params.id) {
        const compra = await getCompra(params.id);
        setValue("repuesto", compra.repuesto);
        setSelectedRepuesto(compra.repuesto);
        setValue("cantidad_repuesto", compra.cantidad_repuesto);
        setValue("cantidad", compra.repuestos.cantidad);
        setSelectedRepuesto(compra.cantidad);


        setValue("precio_unitario", compra.precio_unitario);
        setValue("precio_total", compra.precio_total);
        setValue("fecha", dayjs(compra.fecha).utc().format("YYYY-MM-DD"))
      }
    })();
  }, []);

  useEffect(() => {
    try {
      getRepuestos();
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  }, []);

  useEffect(() => {
    if (selectedRepuesto) {
      const selectedRepuestoData = repuestos.find(
        (repuesto) => repuesto._id === selectedRepuesto
      );
      if (selectedRepuestoData) {
        // setValue("precio_unitario", selectedRepuestoData.precio);
        setValue("cantidad", selectedRepuestoData.cantidad);
      }
    }
  }, [selectedRepuesto]);

  const onSubmit = handleSubmit(async (data) => {

    // CUADRAR POR SI ALGO
    if(!data.fecha){
      data.fecha = dayjs().format("YYYY-MM-DD");
    }

    data.precio_total = data.cantidad_repuesto * data.precio_unitario;

    if (params.id) {
      const res = updateCompra(params.id, data);
      if (res) navigate("/compras")
    } else {
      const res = await createCompra(data);
      if (res) navigate("/compras")

    }

  });

  console.log(comprasErrors);



  return (
    <div className="flex items-center justify-center pt-20">
      <div className="bg-slate-700 max-w-md w-full p-10 shadow-lg shadow-blue-600/40">
        {comprasErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
        <h1 className="text-2xl flex justify-center ">Agregar Compra </h1>
        <form className="mt-10" onSubmit={onSubmit}>
          <label>Repuestos<span className="text-red-500">*</span></label>
          <select
            {...register("repuesto", RepuestoRequired)}
            className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
            onChange={(e) => setSelectedRepuesto(e.target.value)}
          >
            <option value="">Selecciona un repuesto</option>
            {repuestos.map((repuesto) => (
              <option key={repuesto._id} value={repuesto._id}>
                {repuesto.nombre_repuesto}
              </option>
            ))}
          </select>
          {errors.repuesto && <p className="text-red-500">{errors.repuesto.message}</p>}
          <label>Cantidad existente</label>
          <input
            placeholder="cantidad"
            {...register("cantidad")}
            className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
            disabled

          />
          <label>Cantidad a comprar<span className="text-red-500">*</span></label>
          <input
            placeholder="Cantidad"
            {...register("cantidad_repuesto", NegativeRequired)}
            className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
            onChange={(e) => {
              const cantidad = parseFloat(e.target.value);
              // const precioUnitario = parseFloat(register("precio_unitario").value);
              const precioTotal = isNaN(cantidad) || isNaN(precioUnitario)
                ? ""
                : (cantidad * precioUnitario).toFixed(2);
              setValue("precio_total", precioTotal);
            }}
          />
          {errors.cantidad_repuesto && <p className="text-red-500">{errors.cantidad_repuesto.message}</p>}


          <label>Precio del repuesto<span className="text-red-500">*</span></label>
          <input
            placeholder="Precio_repuesto"
            {...register("precio_unitario", NegativeRequired)}
            className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
          />
          {errors.precio_unitario && <p className="text-red-500">{errors.precio_unitario.message}</p>}
          {/* <label>Precio total</label> */}
          {/* <input
            placeholder="Precio Total"
            {...register("precio_total")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          /> */}
          <label htmlFor="fecha">Fecha</label>
          <input type="date"
          className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
          {...register("fecha", { min: `${currentYear}-01-01`, max: `${currentYear}-12-31` }, fecha)}
           />

          {errors.fecha && <p className="text-red-500">{errors.fecha.message}</p>}



          {/* <label >Estado</label>
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

        </select> */}
          {errors.cliente && <p className="text-red-500">{errors.cliente.message}</p>}
          <button className="px-5 py-1 mt-4 text-sm text-withe font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 d" type="submit">
            Guardar
          </button>
          <button>
            <Link className="px-5 py-1 text-sm text-withe font-semibold  rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ml-5  " to="/compras">Cancelar</Link>
          </button>
        </form>
      </div>
    </div>
  );
}