import React, { useEffect, useState } from "react";
import { useVentasRepuestos } from "../../context/VentasRepuestoContex";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useClientes } from "../../context/ClientContext";
import { useRepuestos } from "../../context/RepuestosContext";
import { NombreRequired, RepuestoRequired } from "../../utils/validations";

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
  const [selectedRepuesto, setSelectedRepuesto] = useState(null);

  useEffect(() => {
    (async () => {
      if (params.id) {
        const ventaRepuesto = await getVentaRepuesto(params.id);
        setValue("repuesto", ventaRepuesto.repuesto);
        setSelectedRepuesto(ventaRepuesto.repuesto);
        setValue("cantidad_repuesto", ventaRepuesto.cantidad_repuesto);
        setValue("precio_unitario", ventaRepuesto.precio_unitario);
        setValue("precio_total", ventaRepuesto.precio_total);
        setValue("cliente", ventaRepuesto.cliente);
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
      }
    }
  }, [selectedRepuesto]);

  const onSubmit = handleSubmit(async(data) => {
    // Calcular el precio total antes de enviar el formulario
    data.precio_total = data.cantidad_repuesto * data.precio_unitario;

    if (params.id) {
      updateVentaRepuesto(params.id, data);
    } else {
      await createVentaRepuesto(data);
      
    }
    navigate("/ventas-respuestos");
  });

  console.log(ventasRepuestosErrors);


  
  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
        {ventasRepuestosErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
        <form onSubmit={onSubmit}>
          <label>Repuestos</label>
          <select
            {...register("repuesto")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            onChange={(e) => setSelectedRepuesto(e.target.value)}
          >
            <option value="">Selecciona un repuesto</option>
            {repuestos.map((repuesto) => (
              <option key={repuesto._id} value={repuesto._id}>
                {repuesto.nombre_repuesto}
              </option>
            ))}
          </select>
          <label>Cantidad</label>
          <input
            placeholder="Cantidad"
            type="number"
            {...register("cantidad_repuesto", NombreRequired )}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
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
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
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
          <button className="px-5 py-1 text-sm text-withe font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 d" type="submit">
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}
