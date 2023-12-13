import React, { useEffect, useState } from "react";
import { useRepuestos } from "../../context/RepuestosContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMarcas } from "../../context/MarcasContext";
import { NegativeRequired, NombreRequired, RepuestoRequired, nombre_RepuestoValidacion } from "../../utils/validations";


export default function FormRepuesto() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const {
    createRepuesto,
    getRepuesto,
    updateRepuesto,
    errors: repuestosErrors,
  } = useRepuestos();
  const { marcas, getMarcas } = useMarcas();
  const navigate = useNavigate();
  const params = useParams();
  const [selectedMarca, setSelectedMarca] = useState();

  useEffect(() => {
    (async () => {
      if (params.id) {
        const repuesto = await getRepuesto(params.id);
        setValue("nombre_repuesto", repuesto.nombre_repuesto);
        setValue("marca", repuesto.marca);
        setSelectedMarca(repuesto.marca);
        setValue("cantidad", repuesto.cantidad);
        setValue("precio", repuesto.precio);

      }
    })();
  }, []);

  useEffect(() => {
    try {
      getMarcas();
    } catch (error) {
      console.error("Error al obtener marcas:", error);
    }
  }, []);

  useEffect(() => {
    if (selectedMarca) {
      const selectedMarcaData = marcas.find(
        (marca) => marca._id === selectedMarca
      );
      if (selectedMarcaData) {
        // setValue("precio_unitario", selectedRepuestoData.precio);
        setValue("nombre_marca", selectedMarca.nombre_marca);
      }
    }
  }, [selectedMarca]);

  const onSubmit = handleSubmit(async (data) => {


    if (params.id) {
      const res = updateRepuesto(params.id, data);
      if (res) navigate("/repuestos")
    } else {
      const res = await createRepuesto(data);
      if (res) navigate("/repuestos")

    }

  });

  console.log(repuestosErrors);



  return (
    <div className="flex items-center justify-center pt-20">
      <div className="bg-slate-700 max-w-md w-full p-10 shadow-lg shadow-blue-600/40">
        {repuestosErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}


        <h1 className="text-2xl flex justify-center ">Agregar repuesto</h1>
        <form className="mt-10" onSubmit={onSubmit}>



          <label>Nombre Repuesto<span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder='Nombre'
            {...register("nombre_repuesto", nombre_RepuestoValidacion)}
            className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
            autoFocus
          />
          {errors.nombre_repuesto && <p className="text-red-500">{errors.nombre_repuesto.message}</p>}


          <label>Marca<span className="text-red-500">*</span></label>
          <select
            {...register("marca", RepuestoRequired)}
            className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
            onChange={(e) => selectedMarca(e.target.value)}
          >
            <option value="">Selecciona una marca</option>
            {marcas.map((marca) => (
              <option key={marca._id} value={marca._id}>
                {marca.nombre_marca}
              </option>
            ))}
          </select>
          {errors.marca && <p className="text-red-500">{errors.marca.message}</p>}


          <label>Cantidad<span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder='Cantidad'
            {...register("cantidad", NegativeRequired)}
            className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
            
          />
          {errors.cantidad && <p className="text-red-500">{errors.cantidad.message}</p>}


          <label>Precio del repuesto<span className="text-red-500">*</span></label>
          <input
            placeholder="precio"
            {...register("precio", NegativeRequired)}
            className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
          />
          {errors.precio && <p className="text-red-500">{errors.precio.message}</p>}



            {/* ESTADO DEL REPUESTO */}
          <label >Estado</label>
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




          {/* <label>Precio total</label> */}
          {/* <input
            placeholder="Precio Total"
            {...register("precio_total")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          /> */}


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
          <button className="px-5 py-1 mt-4 text-sm text-withe font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 d" type="submit">
            Guardar
          </button>
          <button>
            <Link className="px-5 py-1 text-sm text-withe font-semibold  rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ml-5  " to="/repuestos">Cancelar</Link>
          </button>
        </form>
      </div>
    </div>
  );
}