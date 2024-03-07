import React, { useEffect, useState } from "react";
import { useVentasRepuestos } from "../../context/VentasRepuestoContex";
import { Link, useNavigate, useParams, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useClientes } from "../../context/ClientContext";
import { useRepuestos } from "../../context/RepuestosContext";
import {
  NegativeRequired,
  RepuestoRequired,
  ClienteRequired,
} from "../../utils/validations";
import { useAuth } from "../../hooks/useAuth";

export default function FormVentaRepuesto() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
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
  const [tablaVentas, setTablaVentas] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      if (params.id) {
        const ventaRepuesto = await getVentaRepuesto(params.id);
        setValue("repuestos", ventaRepuesto.repuesto);
        setSelectedRepuesto(ventaRepuesto.repuesto);
        setValue("cantidad_vender", ventaRepuesto.cantidad_repuesto);
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

  const onSubmit = handleSubmit(async () => {
    const precioTotal =
      parseFloat(getValues("cantidad_vender")) *
      parseFloat(getValues("precio_unitario"));
    setValue("precio_total", precioTotal.toFixed(2));
    const formData = {
      repuestos: [
        {
          repuesto: {
            _id: getValues("repuestos"),
            nombre_repuesto: "",
          },
          cantidad_vender: getValues("cantidad_vender"),
        },
      ],
      cliente: getValues("cliente"),
      precio_total: getValues("precio_total"),
      cantidad_vender: getValues("cantidad_vender"),
      tablaVentas: [...tablaVentas],
    };

    // Combine form data with client data
    const finalData = {
      cliente: formData.cliente,
      repuestos: formData.repuestos,
      precio_total: formData.precio_total,
      cantidad_vender: formData.cantidad_vender,
      tablaVentas: formData.tablaVentas,
    };
    try {
      await createVentaRepuesto(formData);
      reset();
      navigate("/ventas-repuestos");
    } catch (error) {
      console.error("Error al crear la venta:", error);
    }
    // Perform your submission logic here
  });

  const handleAddToTable = async () => {
    const repuestoSeleccionado = repuestos.find(
      (repuesto) => repuesto._id === getValues("repuestos")
    );

    const dataToAdd = {
      repuestos: repuestoSeleccionado
        ? repuestoSeleccionado.nombre_repuesto
        : "",
      cantidad_vender: parseFloat(getValues("cantidad_vender")),
      precio_unitario: parseFloat(getValues("precio_unitario")),
      precio_total:
        parseFloat(getValues("cantidad_vender")) *
        parseFloat(getValues("precio_unitario")),
    };

    // Agregar a la tabla
    setTablaVentas([...tablaVentas, dataToAdd]);

    // Limpiar campos después de añadir a la tabla
    setValue("repuestos", "");
    setValue("cantidad_vender", "");
    setValue("cantidad", "");
    setValue("precio_unitario", "");
    setValue("precio_total", "");
  };

  const permissions = user?.rol?.permissions || [];

  return (
    <>
      {permissions.includes("Venta Repuesto") ? (
        <div className="flex items-center justify-center pt-20">
          <div className="bg-slate-700 max-w-md w-full p-10 shadow-lg shadow-blue-600/40">
            {ventasRepuestosErrors.map((error, i) => (
              <div className="bg-red-500 p-2 text-white" key={i}>
                {error}
              </div>
            ))}
            <h1 className="text-2xl flex justify-center ">
              Agregar Venta Repuesto{" "}
            </h1>
            <form className="mt-10" onSubmit={onSubmit}>
              <label>
                Repuestos<span className="text-red-500">*</span>
              </label>
              <select
                {...register("repuestos")}
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
              {errors.repuestos && (
                <p className="text-red-500">{errors.repuestos.message}</p>
              )}
              <label>
                Cantidad existente<span className="text-red-500">*</span>
              </label>
              <input
                placeholder="cantidad"
                {...register("cantidad")}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
                disabled
              />
              <label>
                Cantidad a vender<span className="text-red-500">*</span>
              </label>
              <input
                placeholder="Cantidad"
                type="number"
                {...register("cantidad_vender")}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
                onChange={(e) => {
                  const cantidad = parseFloat(e.target.value);
                  const precioUnitario = parseFloat(
                    register("precio_unitario").value
                  );
                  const precioTotal =
                    isNaN(cantidad) || isNaN(precioUnitario)
                      ? ""
                      : (cantidad * precioUnitario).toFixed(2);
                  setValue("precio_total", precioTotal);
                }}
              />
              {errors.cantidad_vender && (
                <p className="text-red-500">{errors.cantidad_vender.message}</p>
              )}
              <label>
                Precio De Repuesto<span className="text-red-500">*</span>
              </label>
              <input
                placeholder="Precio_repuesto"
                {...register("precio_unitario")}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
              />

              <label>
                Cliente<span className="text-red-500">*</span>
              </label>
              <select
                {...register("cliente")}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
              >
                <option value="">Selecciona un cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente._id} value={cliente._id}>
                    {cliente.nombre_cliente}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddToTable}
                className="px-5 py-1 mt-4 text-sm text-withe font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 d"
              >
                Agregar a la tabla
              </button>
              <table className="mt-4 w-full">
                <thead>
                  <tr>
                    <th>Repuestos</th>
                    <th>Cantidad a vender</th>
                    <th>Precio unitario</th>
                    <th>Precio total</th>
                  </tr>
                </thead>
                <tbody>
                  {tablaVentas.map((venta, index) => (
                    <tr key={index}>
                      <td>{venta.repuestos}</td>
                      <td>{venta.cantidad_vender}</td>
                      <td>{venta.precio_unitario}</td>
                      <td>{venta.precio_total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {errors.cliente && (
                <p className="text-red-500">{errors.cliente.message}</p>
              )}
              <button
                className="px-5 py-1 mt-4 text-sm text-withe font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 d"
                type="submit"
              >
                Guardar
              </button>
              <button>
                <Link
                  className="px-5 py-1 text-sm text-withe font-semibold  rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ml-5  "
                  to="/ventas-repuestos"
                >
                  Cancelar
                </Link>
              </button>
            </form>
          </div>
        </div>
      ) : (
        <Navigate to="/tasks" />
      )}
    </>
  );
}
