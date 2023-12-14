import React, { useEffect, useState } from "react";
import { useCompras } from "../../context/ComprasContext";
import { Link, useNavigate } from "react-router-dom";
import utc from "dayjs/plugin/utc";
import dayjs from 'dayjs';
dayjs.extend(utc);

import { useForm, useFieldArray } from "react-hook-form";
import { useRepuestos } from "../../context/RepuestosContext";
import { NegativeRequired, RepuestoRequired, fecha, nombre_RepuestoValidacion, codeCompra, NombreMaRequired } from "../../utils/validations";

import { faLock, faDollarSign, faBan, faDownload, faInfoCircle, faIdCard, faScrewdriverWrench, faHashtag, faShoppingBag, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

  const { fields } = useFieldArray({
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
  const [availableRepuestos, setAvailableRepuestos] = useState([]);
  const [proveedorCompra, setProveedorCompra] = useState("");
  const [codigo, setCodigo] = useState("");
  const [fechaCompra, setFechaCompra] = useState("");
  const [precioTotalCompra, setPrecioTotalCompra] = useState(0);

  useEffect(() => {
    try {
      getRepuestos();
    } catch (error) {
      console.error("Error al obtener repuestos:", error);
    }
  }, []);

  useEffect(() => {
    setAvailableRepuestos(repuestos);
  }, [repuestos]);

  const onSubmit = handleSubmit((data) => {
    setProveedorCompra(data.proveedorCompra);
    setCodigo(data.codigo);
    setFechaCompra(data.fecha);

    const repuestoData = {
      repuesto: repuestos.find((repuesto) => repuesto._id === data.repuestos[0].repuesto),
      cantidad_repuesto: data.repuestos[0].cantidad_repuesto,
      precio_unitario: data.repuestos[0].precio_unitario,
      precio_total: data.repuestos[0].cantidad_repuesto * data.repuestos[0].precio_unitario,
    };

    setRepuestosList([...repuestosList, repuestoData]);

    const updatedAvailableRepuestos = availableRepuestos.filter(
      (repuesto) => repuesto._id !== selectedRepuesto
    );
    setAvailableRepuestos(updatedAvailableRepuestos);

    // Actualizar el estado de la suma total
    setPrecioTotalCompra(precioTotalCompra + repuestoData.precio_total);

    reset({
      ...fields.reduce((acc, _, index) => {
        acc[`repuestos.${index}.repuesto`] = "";
        acc[`repuestos.${index}.cantidad_repuesto`] = "";
        acc[`repuestos.${index}.precio_unitario`] = "";
        return acc;
      }, {}),
      fecha: data.fecha,
      proveedorCompra: data.proveedorCompra,
      codigo: data.codigo,
    });
  });

  const guardarCompra = async () => {
    let fechaGuardada = fechaCompra;

    if (!fechaGuardada) {
      fechaGuardada = dayjs().format("YYYY-MM-DD");
    }

    const compraData = {
      fecha: fechaGuardada,
      proveedor: proveedorCompra,
      codigo: codigo,
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

  const eliminarRepuesto = (index) => {
    const updatedRepuestosList = [...repuestosList];
    const repuestoEliminado = updatedRepuestosList.splice(index, 1)[0];
    setRepuestosList(updatedRepuestosList);

    setAvailableRepuestos([...availableRepuestos, repuestoEliminado.repuesto]);

    // Actualizar el estado de la suma total
    setPrecioTotalCompra(precioTotalCompra - repuestoEliminado.precio_total);
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

          <div className="flex">
            <div className="mr-4">
              {/* <label>Proveedor</label> */}
              <input
                style={{ width: '220px' }}
                placeholder="Proveedor"
                {...register("proveedorCompra", {
                  ...nombre_RepuestoValidacion,
                  required: "El proveedor es requerido",
                })}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2 my-2"
              />
              {errors.proveedorCompra && (
                <p className="text-red-500 mt-2">{errors.proveedorCompra.message}</p>
              )}
            </div>

            <div>
              {/* <label>Código</label> */}
              <input
                style={{ width: '220px', marginRight: '150px' }}
                placeholder="Código"
                {...register("codigo", {
                  ...NombreMaRequired,
                  required: "El código de compra es requerido",
                })}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2 my-2"
              />
              {errors.codigo && (
                <p className="text-red-500 mt-2">{errors.codigo.message}</p>
              )}

            </div>




            <button
              className="px-5 py-2 mr-8 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent" title="Agregar"
              type="submit" disabled={selectedRepuesto === ""}>
              <FontAwesomeIcon icon={faPlus} />
            </button>






          </div>










          {fields.map((item, index) => (
            <div key={item.id} className="flex my-2">

              <div className="mr-4">

                <select
                  style={{ width: '220px' }}
                  {...register(`repuestos.${index}.repuesto`, RepuestoRequired)}
                  className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2 my-2"
                  onChange={(e) => {
                    setSelectedRepuesto(e.target.value);
                  }}
                >
                  <option value="">Selecciona un repuesto</option>
                  {availableRepuestos.map((repuesto) => (
                    <option
                      key={repuesto._id}
                      value={repuesto._id}
                    >
                      {repuesto.nombre_repuesto}
                    </option>
                  ))}
                </select>
                {errors.repuestos && errors.repuestos[index] && errors.repuestos[index].repuesto && errors.repuestos[index].repuesto.message && (
                  <p className="text-red-500 mt-2">{errors.repuestos[index].repuesto.message}</p>
                )}
              </div>

              <div className="mr-4">

                <input
                  style={{ width: '220px' }}
                  placeholder="Cantidad"
                  {...register(`repuestos.${index}.cantidad_repuesto`, NegativeRequired)}
                  className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2 my-2"
                />
                {errors.repuestos && errors.repuestos[index] && errors.repuestos[index].cantidad_repuesto && (
                  <p className="text-red-500 mt-2">{errors.repuestos[index].cantidad_repuesto.message}</p>
                )}
              </div>



              <div>

                <input
                  style={{ width: '220px' }}
                  placeholder="Precio unitario"
                  {...register(`repuestos.${index}.precio_unitario`, RepuestoRequired)}
                  className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2 my-2"
                />
                {errors.repuestos && errors.repuestos[index] && errors.repuestos[index].precio_unitario && (
                  <p className="text-red-500 mt-2">{errors.repuestos[index].precio_unitario.message}</p>
                )}
              </div>




            </div>

          ))}

          <br />

          <h2 className="text-xl font-semibold mt-4 ">Repuestos Agregados:</h2>

          <ul>
            {repuestosList.map((repuesto, index) => (
              <li key={index}>
                {repuesto.repuesto.nombre_repuesto} - Cantidad: {repuesto.cantidad_repuesto}, Precio Unitario: {repuesto.precio_unitario}, Precio Total: {repuesto.precio_total}
                <button
                  className="ml-2 text-red-500"
                  onClick={() => eliminarRepuesto(index)}
                >
                  <FontAwesomeIcon icon={faTrash} />

                </button>
              </li>
            ))}
          </ul>


          
          {/* Mostrar la suma total de los precios */}
          

          <input
            style={{ width: '220px' }}
            type="date"
            className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2 my-2"
            {...register("fecha", { min: `${currentYear}-01-01`, max: `${currentYear}-12-31` }, fecha)}
            onChange={(e) => setFechaCompra(e.target.value)}
          />
          <br />

          <button
            type="button"
            className="px-5 py-1 mt-4 text-sm text-withe font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30"
            onClick={guardarCompra}
            disabled={repuestosList.length === 0 || errors.proveedorCompra || errors.codigo}
          >
            Guardar
          </button>
          <button type="button">
            <Link className="px-5 py-1 text-sm text-withe font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ml-5" to="/compras">Cancelar</Link>
          </button>
       
        </form>
          <p className="text-right">Precio total compra: {precioTotalCompra}</p>

      </div>
      
    </div>
  );
}
