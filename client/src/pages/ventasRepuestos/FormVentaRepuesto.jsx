import React, { useEffect, useState } from "react";
import { useVentasRepuestos } from "../../context/VentasRepuestoContex";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useClientes } from "../../context/ClientContext";
import { useRepuestos } from "../../context/RepuestosContext";
import { NegativeRequired, NombreRequired, RepuestoRequired, ClienteRequired } from "../../utils/validations";

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
  const [repuestosSeleccionados, setRepuestosSeleccionados] = useState([]);
  const [totalVenta, setTotalVenta] = useState(0);

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

  const onSubmit = handleSubmit(async (data) => {
    const precioTotalRepuesto = data.cantidad_repuesto * data.precio_unitario;
  
    const nuevoRepuesto = {
      repuesto: data.repuesto,
      cantidad_vender: data.cantidad_repuesto,
      precio_unitario: data.precio_unitario,
      precio_total: precioTotalRepuesto,
    };
  
    const repuestosActualizados = [...repuestosSeleccionados, nuevoRepuesto];
  
    setRepuestosSeleccionados(repuestosActualizados);
  
    const totalVentaActualizado = repuestosActualizados.reduce(
      (total, repuesto) => total + repuesto.precio_total,
      0
    );
  
    setTotalVenta(totalVentaActualizado);
  
    if (params.id) {
      const res = updateVentaRepuesto(params.id, { ...data, precio_total: totalVentaActualizado });
      if (res) navigate("/ventas-repuestos");
    } else {
      const res = await createVentaRepuesto({ ...data, precio_total: totalVentaActualizado });
      if (res) navigate("/ventas-repuestos");
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
        <h1 className="text-2xl flex justify-center ">Agregar Venta Repuesto </h1>
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
          <label>Cantidad existente<span className="text-red-500">*</span></label>
          <input
            placeholder="cantidad"
            {...register("cantidad")}
            className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
            disabled
          />
          <label>Cantidad a vender<span className="text-red-500">*</span></label>
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
          <label>Precio De Repuesto<span className="text-red-500">*</span></label>
          <input
            placeholder="Precio_repuesto"
            {...register("precio_unitario")}
            className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
          />
          <label>Cliente<span className="text-red-500">*</span></label>
          <select
            {...register("cliente", ClienteRequired )}
            className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
          >
            <option value="">Selecciona un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente._id} value={cliente._id}>
                {cliente.nombre_cliente}
              </option>
            ))}
          </select>
          {errors.cliente && <p className="text-red-500">{errors.cliente.message}</p>}
          <div>
            <h2>Lista de Repuestos:</h2>
            <table>
              <thead>
                <tr>
                  <th>Repuesto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Precio Total</th>
                </tr>
              </thead>
              <tbody>
                {repuestosSeleccionados.map((repuesto, index) => (
                  <tr key={index}>
                    <td>{repuestos.find(item => item._id === repuesto.repuesto)?.nombre_repuesto}</td>
                    <td>{repuesto.cantidad_vender}</td>
                    <td>{repuesto.precio_unitario}</td>
                    <td>{repuesto.precio_total}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p>Total de la Venta: {totalVenta}</p>
          </div>

          <button className="px-5 py-1 mt-4 text-sm text-withe font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 d" type="submit">
            Guardar
          </button>
          <Link className="px-5 py-1 text-sm text-withe font-semibold  rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ml-5  " to="/ventas-repuestos">
            Cancelar
          </Link>
        </form>
      </div>
    </div>
  );
}
