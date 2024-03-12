import React, { useEffect, useState } from "react";
import { useRepuestos } from "../../context/RepuestosContext";
import { Link, useNavigate, useParams, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMarcas } from "../../context/MarcasContext";
import {
  NegativeRequired,
  RepuestoRequired,
  NombreRepuestoRequired,
  precioRepuesto,
} from "../../utils/validations";
import Swal from "sweetalert2";
import { useAuth } from "../../hooks/useAuth";

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
  const [activeMarcas, setActiveMarcas] = useState([]);
  const [imageBase64, setImageBase64] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [formTitle, setFormTitle] = useState("Agregar repuesto");
  const { user } = useAuth();


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFileName(file.name); // Establece el nombre del archivo
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    try {
      getMarcas();
    } catch (error) {
      console.error("Error al obtener marcas:", error);
    }
  }, []);

  useEffect(() => {
    const activeMarcasList = marcas.filter(
      (marca) => marca.estado === "Activo"
    );
    setActiveMarcas(activeMarcasList);
  }, [marcas]);

  useEffect(() => {
    (async () => {
      if (params.id) {
        setFormTitle("Editar repuesto");
        const repuesto = await getRepuesto(params.id);
        // Resto del código...
        if (repuesto.img) {
          setImageBase64(repuesto.img);
          setImageFileName(repuesto)
        }
      }
    })();
  }, [params.id]);


  useEffect(() => {
    (async () => {
      if (params.id) {
        const repuesto = await getRepuesto(params.id);
        setValue("name", repuesto.name);
        setValue("amount", repuesto.amount);
        setValue("marca", repuesto.marca);
        setSelectedMarca(repuesto.marca);
        setValue("nombre_marca", repuesto.nombre_marca);
        setValue("price", repuesto.price);
        setValue("img", repuesto.img)
 
        // Setear el nombre de la imagen si existe
        if (repuesto.img) {
          setImageBase64(repuesto.img);
        }
      }
    })();
  }, [params.id]);


  useEffect(() => {
    if (selectedMarca) {
      const selectedMarcaData = marcas.find(
        (marca) => marca._id === selectedMarca
      );
      if (selectedMarcaData) {
        setValue("nombre_marca", selectedMarca.nombre_marca);
      }
    }
  }, [selectedMarca]);

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setImageName(file.name); // Actualiza el nombre del archivo
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImageBase64(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };


  const onSubmit = handleSubmit(async (data) => {
    data.img = imageBase64;

    console.log("datos aness", data);
    console.log("img", data.img);

    if (params.id) {
      const res = await updateRepuesto(params.id, data);
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
      if (res) navigate("/repuestos");
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
          title: "Ya tienes un repuesto similar",
        });
      }
    } else {
      console.log("como se ven los datos", data);
      const res = await createRepuesto(data);
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
      if (res) navigate("/repuestos");
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
          title: "Ya tienes un repuesto similar",
        });
      }
    }
  });

  console.log(repuestosErrors);

  const permissions = user?.rol?.permissions || [];

  return (
    <>
      {permissions.includes("Repuestos") ? (
        <div className="flex items-center justify-center pt-20">
          <div className="bg-slate-700 max-w-md w-full p-10 shadow-lg shadow-blue-600/40">
            {Array.isArray(repuestosErrors) &&
              repuestosErrors.map((error, i) => (
                <div className="bg-red-500 p-2 text-white" key={i}>
                  {error}
                </div>
              ))}

            <h1 className="text-2xl flex justify-center ">{formTitle}</h1>
            <form className="mt-10" onSubmit={onSubmit}>
              <label>
                Nombre Repuesto<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nombre"
                {...register("name", NombreRepuestoRequired)}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
                autoFocus
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}

              <label>
                Marca<span className="text-red-500">*</span>
              </label>
              <select
                {...register("marca", RepuestoRequired)}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
                onChange={(e) => setSelectedMarca(e.target.value)}
              >
                <option value="">Selecciona una marca</option>
                {activeMarcas.map((marca) => (
                  <option key={marca._id} value={marca._id}>
                    {marca.nombre_marca}
                  </option>
                ))}
              </select>
              {errors.marca && (
                <p className="text-red-500">{errors.marca.message}</p>
              )}

              <label>
                Cantidad
              </label>
              <input
                value={0}
                type="text"
                placeholder="Cantidad"
                {...register("amount")}
                readOnly // Hace que el input no sea editable
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2 my-2"
              />


              <label>
                Precio del repuesto<span className="text-red-500">*</span>
              </label>
              <input
                placeholder="precio"
                {...register("price", precioRepuesto)}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
              />
              {errors.price && (
                <p className="text-red-500">{errors.price.message}</p>
              )}

              <label>
                Imagen Repuesto<span className="text-red-500"></span>
              </label>
              <input
                id="imagen"
                {...register("img")} // Aquí agregamos el register para el campo de imagen
                type="file"
                onChange={handleImageChange}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
                autoFocus
              />
              {errors.img && (
                <p className="text-red-500">{errors.img.message}</p>
              )}


              {imageBase64 && (
                <img
                  src={imageBase64}
                  alt="Preview"
                  style={{ width: "40%", marginTop: "10px" }}
                />
              )}



              <label className="hidden">Estado</label>
              <select
                {...register("estado")}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2 hidden"
              >
                <option value={"Activo"}>Activo</option>
                <option value={"Inactivo"}>Inactivo</option>
              </select>
              {/* <input
            {...register("InCart")}
            value={false}
            className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2 hidden"
          >
            
          </input> */}

              <button
                className="px-5 py-1 mt-4 text-sm text-withe font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 d"
                type="submit"
              >
                Guardar
              </button>
              <button>
                <Link
                  className="px-5 py-1 text-sm text-withe font-semibold  rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ml-5  "
                  to="/repuestos"
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