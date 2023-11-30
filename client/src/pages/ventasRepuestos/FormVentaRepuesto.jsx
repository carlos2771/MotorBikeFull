import React, { useEffect, useState } from "react";
import { useVentasRepuestos } from "../../context/VentasRepuestoContex";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useClientes } from "../../context/ClientContext";
import { useRepuestos } from "../../context/RepuestosContext";
import { NegativeRequired, NombreRequired, RepuestoRequired } from "../../utils/validations";


export default function FormVentaRepuesto() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const {
    createVentaRepuesto,
    getVentaRepuesto,
    updateVentaRepuesto,
    errors: ventasRepuestosErrors,
  } = useVentasRepuestos();
  const { clientes, getClientes } = useClientes();
  const { repuestos, getRepuestos } = useRepuestos();
  const navigate = useNavigate();
  const params = useParams();
  const [selectedRepuesto, setSelectedRepuesto] = useState();

  useEffect(() => {
    (async () => {
      if (params.id) {
        const ventaRepuesto = await getVentaRepuesto(params.id);
        setValue("repuesto", ventaRepuesto.repuesto);
        setSelectedRepuesto(ventaRepuesto.repuesto);
        setValue("cantidad_repuesto", ventaRepuesto.cantidad_repuesto);
        setValue("cantidad", ventaRepuesto.repuestos.cantidad);
        setSelectedRepuesto(ventaRepuesto.cantidad);
        setValue("precio_unitario", ventaRepuesto.precio_unitario);
        setValue("precio_total", ventaRepuesto.precio_total);
        setValue("cliente", ventaRepuesto.cliente._id);
      }
    })();
  }, []);

  useEffect(() => {
    try {
      getClientes();
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
        setValue("precio_unitario", selectedRepuestoData.precio);
        setValue("cantidad", selectedRepuestoData.cantidad);
      }
    }
  }, [selectedRepuesto]);

  const onSubmit = handleSubmit(async(data) => {
    data.precio_total = data.cantidad_repuesto * data.precio_unitario;

    if (params.id) {
      const res = updateVentaRepuesto(params.id, data);
        if(res) navigate("/ventas-repuestos")
    } else {
      const res = await createVentaRepuesto(data);
        if(res) navigate("/ventas-repuestos")
      
    }
    
  });

  console.log(ventasRepuestosErrors);


  
  return (
    <div className="flex items-center justify-center pt-20">
      <div className="bg-slate-700 max-w-md w-full p-10 shadow-lg shadow-blue-600/40">
        {ventasRepuestosErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
        <h1 className="text-2xl flex justify-center ">Agregar Venta Repueso </h1>
        <form className="mt-10" onSubmit={onSubmit}>
          <label>Repuestos</label>
          <select
            {...register("repuesto", NombreRequired)}
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
          <label>Cantidad a vender</label>
          <input
            placeholder="Cantidad"
            type="number"
            {...register("cantidad_repuesto", NegativeRequired )}
            className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
            onChange={(e) => {
              const cantidad = parseFloat(e.target.value);
              const precioUnitario = parseFloat(register("precio_unitario").value);
              const precioTotal = isNaN(cantidad) || isNaN(precioUnitario)
                ? ""
                : (cantidad * precioUnitario).toFixed(2);
              setValue("precio_total", precioTotal);
            }}
          />
          {errors.cantidad_repuesto && <p className="text-red-500">{errors.cantidad_repuesto.message}</p>}
          <label>Precio De Repuesto</label>
          <input
            placeholder="Precio_repuesto"
            {...register("precio_unitario")}
            className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
          />
          {/* <label>Precio total</label> */}
          {/* <input
            placeholder="Precio Total"
            {...register("precio_total")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          /> */}
          <label>Cliente</label>
          <select
            {...register("cliente",NombreRequired )}
            className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
          >
            <option value="">Selecciona un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente._id} value={cliente._id}>
                {cliente.nombre_cliente}
              </option>
            ))}
          </select>
          
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
          <Link className="px-5 py-1 text-sm text-withe font-semibold  rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ml-5  " to="/ventas-repuestos">Cancelar</Link>
        </button>
        </form>
      </div>
    </div>
  );
}