import React, { useEffect, useState } from "react";
import { useCompras } from "../../context/ComprasContext";
import { Link, useNavigate, Navigate} from "react-router-dom";
import utc from "dayjs/plugin/utc";
import dayjs from 'dayjs';
dayjs.extend(utc);

import { useForm, useFieldArray } from "react-hook-form";
import { useRepuestos } from "../../context/RepuestosContext";
import { NegativeRequired, RepuestoRequired, fecha, nombre_RepuestoValidacion, codeCompra, NombreMaRequired, NombreRepuestoRequired, NombreProveedor } from "../../utils/validations";
// IMPORT DEL DATATABLE
import MUIDataTable from "mui-datatables";
import { faLock, faDollarSign, faBan, faDownload, faInfoCircle, faIdCard, faScrewdriverWrench, faHashtag, faShoppingBag, faPlus, faTrash, faCheck, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const currentYear = dayjs().year();
import Swal from 'sweetalert2';

import { useAuth } from "../../hooks/useAuth";

function formatCurrency(value) {
  const formattedValue = `$${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  return formattedValue;
}

function formatCurrency2(value) {
  const formattedValue = value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return formattedValue;
}

export default function FormCompra() {

  const { compras, getCompras } = useCompras(); ///////

  const { user } = useAuth();

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
  const [activeRepuestos, setActiveRepuestos] = useState([]);

  // Agregar un nuevo estado para almacenar el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");


  const filteredRepuestos = searchTerm.trim() === "" ? activeRepuestos : activeRepuestos.filter(repuesto =>
    repuesto.name.toLowerCase().includes(searchTerm) || repuesto.nombre_marca.toLowerCase().includes(searchTerm)
  );





  // Actualizar la lista de repuestos disponibles cada vez que el término de búsqueda cambie
  useEffect(() => {
    setAvailableRepuestos(filteredRepuestos);
  }, [searchTerm]);


  const handleSearchTermChange = event => {
    const searchTerm = event.target.value.toLowerCase(); // Convertir el término de búsqueda a minúsculas
    setSearchTerm(searchTerm);
  };


  useEffect(() => {
    try {
      getRepuestos();
      getCompras();
    } catch (error) {
      console.error("Error al obtener repuestos:", error);
    }
  }, []);

  useEffect(() => {
    const activeRepuestosList = repuestos.filter(
      (repuesto) => repuesto.estado === 'Activo'
    );
    setActiveRepuestos(activeRepuestosList)
  }, [repuestos]);

  useEffect(() => {
    setAvailableRepuestos(repuestos);
  }, [repuestos]);

  const onSubmit = handleSubmit(async (data) => {
    setProveedorCompra(data.proveedorCompra);
    setCodigo(data.codigo);
    setFechaCompra(data.fecha);
    // Restablecer el valor del input de búsqueda a una cadena vacía
    setSearchTerm('');

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
        nombre_repuesto: repuesto.repuesto.name,
        marca_repuesto: repuesto.repuesto.nombre_marca,
        cantidad_repuesto: repuesto.cantidad_repuesto,
        precio_unitario: repuesto.precio_unitario,
        precio_total: repuesto.cantidad_repuesto * repuesto.precio_unitario,
      })),
    };

    try {
      await createCompra(compraData);
      reset();
      navigate("/compras");
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
        title: "Agregada correctamente",
      });
    } catch (error) {
      console.error("Error al crear la compra:", error);
    }
  };

  // COLUMNAS 

  const columnas2 = [
    { name: "repuesto", label: "Repuesto", options: { filter: true, sort: true } },
    { name: "marca", label: "Marca", options: { filter: true, sort: false } },
    { name: "cantidad", label: "Cantidad", options: { filter: true, sort: false } },
    { name: "precioUnitario", label: "Precio Unitario", options: { filter: true, sort: false } },
    { name: "precioTotal", label: "Precio Total", options: { filter: true, sort: false } },
    {
      name: "accion",
      label: "Acción",
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
            <button title="Eliminar" onClick={() => eliminarRepuesto(rowIndex)} className="btnEliminar text-red-500 ml-200">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          );
        }
      }
    },
  ];


  // Variable para controlar si la fecha es válida o no
  const [isValidFecha, setIsValidFecha] = useState(true);

  // Lógica para verificar si la fecha es válida
  const validarFecha = (fecha) => {
    const fechaIngresada = new Date(fecha);
    const fechaActual = new Date();

    // Verificar si la fecha ingresada no es futura y está dentro del mes actual
    return (
      fechaIngresada <= fechaActual &&
      fechaIngresada.getMonth() === fechaActual.getMonth() &&
      fechaIngresada.getFullYear() === fechaActual.getFullYear()
    );
  };

  // Evento de cambio en el input de fecha
  const handleFechaChange = (e) => {
    const fechaIngresada = e.target.value;
    // Verificar si la fecha ingresada es válida
    const isValid = validarFecha(fechaIngresada);
    // Actualizar el estado isValidFecha en función de la validación
    setIsValidFecha(isValid);
    // También podrías realizar otras acciones necesarias aquí
    setFechaCompra(fechaIngresada);
  };







  const eliminarRepuesto = (index) => {
    const repuestoEliminado = repuestosList[index];
    const updatedRepuestosList = repuestosList.filter((repuesto, i) => i !== index);
    setRepuestosList(updatedRepuestosList);

    // Actualizar el estado de la suma total
    setPrecioTotalCompra(precioTotalCompra - repuestoEliminado.precio_total);

    // Agregar el repuesto eliminado de nuevo a los disponibles
    setAvailableRepuestos([...availableRepuestos, repuestoEliminado.repuesto]);
  };

  const permissions = user?.rol?.permissions || [];

  return (
    <>
    {permissions.includes("Compras") ? (
    <div className="contenedorPrincipal shadow-lg shadow-blue-600/40">
      {comprasErrors.map((error, i) => (
        <div className="bg-red-500 p-2 text-white" key={i}>
          {error}
        </div>
      ))}
      <form action="" onSubmit={onSubmit}>

        <div style={{ alignItems: 'center', marginBottom: '5px' }}>
          <h1 style={{ textAlign: 'center', marginLeft: '5%', fontSize: '150%', marginBottom: '30px', }}>
            Agregar Compra
          </h1>

          {/* FECHA DE LA COMPRA */}
          <label htmlFor="" style={{ marginLeft: '5px' }}>Fecha</label><br />
          <input
            className="bg-slate-800 b-20 border-blue-600 text-white px-4 py-2 my-2 outline-none"
            style={{ marginRight: '10px', borderRadius: '10px', border: '1px solid #2563eb' }}
            type="date"
            {...register("fecha", { min: `${currentYear}-01-01`, max: `${currentYear}-12-31` })}
            onChange={handleFechaChange}
          />
          <br />
          {/* Mostrar mensaje de error si la fecha no es válida */}
          {!isValidFecha && (
            <p className="text-red-500 mb-2" style={{}}>
              Ingresa una fecha válida
            </p>
          )}
        </div>


        <div>
          {fields.map((item, index) => (
            <div className="divGris bg-slate-800 " style={{ borderRadius: '10px', boxShadow: ' 0px 0px 10px rgba(0, 0, 0, 0.5)', padding: '15px' }}>
              <div className="greenContainer">
                <div style={{ position: 'relative', width: '45%' }}>
                  <label htmlFor="">Proveedor <span style={{ color: 'red' }}>*</span></label>

                  <input

                    className="w-full bg-slate-800 border-0 border-b-2 border-blue-600 text-white px-4 py-2 my-2 outline-none"
                    style={{
                      width: '100%', padding: '5px'
                    }}
                    type="text"
                    placeholder="Proveedor"
                    {...register("proveedorCompra", NombreProveedor)}
                    list="listaProveedores"
                  />

                  <datalist

                    id="listaProveedores">
                    {[...new Set(compras.map((compra) => compra.proveedor))].map((proveedor, index) => (
                      <option style={{ color: 'blue' }} key={index} value={proveedor}>
                        {proveedor}
                      </option>
                    ))}
                  </datalist>


                  {errors.proveedorCompra && (
                    <p className="text-red-500 mt-2" style={{ position: 'absolute', top: '80%', left: 0 }}>
                      {errors.proveedorCompra.message}
                    </p>
                  )}
                </div>
                <div style={{ position: 'relative', width: '45%' }}>
                  <label htmlFor="">Código <span style={{ color: 'red' }}>*</span></label>
                  <input
                    className="w-full bg-slate-800 border-0 border-b-2 border-blue-600 text-white px-4 py-2 my-2 outline-none"
                    style={{ width: '100%', padding: '5px' }}
                    type="text"
                    placeholder="Código"
                    {...register("codigo", NombreProveedor)}
                  />
                  {errors.codigo && (
                    <p className="text-red-500 mt-2" style={{ position: 'absolute', top: '80%', left: 0 }}>
                      {errors.codigo.message}
                    </p>
                  )}
                </div>
              </div>


              <div className="divRojo" key={item.id} style={{ marginBottom: '130px' }}>



                {/* SELECT DE LOS REPUESTOS */}
                <div style={{ position: 'relative', width: '100%', marginTop: '100px' }}>







                  <label style={{ marginLeft: '25px', marginTop: '100px' }}>Selecciona un repuesto <span style={{ color: 'red' }}>*</span></label>
                  <input
                    id="search"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    className="input-search"
                    placeholder="Buscar..."
                  />





                  <style>{

                    `
                    
                    

                    .input-search {
                      background-color: #12263a;
                      width: calc(100% - 40px); /* Ajusta el ancho del input menos el ancho del icono */
                      padding: 3px; /* Espacio interno del input */
                      border-radius: 10px; /* Esquinas redondeadas */
                      box-sizing: border-box; /* Incluye el padding y borde en el ancho total */
                      font-size: 16px; /* Tamaño de fuente */
                      outline: none;
                      color: 
                      #bababa;
                      margin-left: 5%; /* Ajusta el margen izquierdo según sea necesario */
                      margin-bottom: 5px;
                    }
                    
                    .search-icon {
                      position: relative;
                      bottom: -7px; 
                      right: 20px; /* Ajusta la posición según sea necesario */
                      transform: translateY(-50%);
                      color: white; /* Color del icono */
                      cursor: pointer;
                    }
                    
                    
                    
                    @media (max-width: 768px) {
                      .input-search {
                        font-size: 14px; /* Reducir el tamaño de fuente en pantallas más pequeñas si es necesario */
                      }

                      .busq{
                        width: 10%; /* Ajusta el ancho para dispositivos móviles */
                        height: 30px; /* Ajusta la altura para dispositivos móviles */
                        font-size: 12px; /* Ajusta el tamaño de fuente para dispositivos móviles */
                      }
                    }
                    `
                  }</style>







                  {/* 
                  <input type="text"
                    style={{ color: 'black' }}
                    id="search"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    placeholder="Buscar" /> */}

                  <select
                    size={5}
                    className="bg-slate-800 border border-3 border-blue-600"
                    style={{ marginLeft: '5%', width: '90%', borderRadius: '10px', padding: '15px', cursor: 'pointer', outline: 'none' }}
                    name=""
                    id=""
                    {...register(`repuestos.${index}.repuesto`, RepuestoRequired)}
                    onChange={(e) => {
                      setSelectedRepuesto(e.target.value);
                    }}
                  >
                    {filteredRepuestos.length === 0 ? (
                      <option disabled style={{ marginLeft: '30%', marginTop: '10%' }}>No hay coincidencias</option>
                    ) : (
                      filteredRepuestos.map((repuesto) => {
                        // Filtrar repuestos disponibles para seleccionar
                        if (!repuestosList.find((item) => item.repuesto._id === repuesto._id)) {
                          return (
                            <option key={repuesto._id} value={repuesto._id}>
                              {repuesto.name} - {repuesto.nombre_marca}
                            </option>
                          );
                        } else {
                          return null;
                        }
                      })
                    )}
                  </select>

                  {errors.repuestos && errors.repuestos[index] && errors.repuestos[index].repuesto && errors.repuestos[index].repuesto.message && (
                    <p style={{ marginTop: '-2px', marginLeft: '7%' }} className="text-red-500">{errors.repuestos[index].repuesto.message}</p>
                  )}
                </div>
              </div>


              {/* INPUT DE CANTIDAD */}
              <div className="divBlanco" style={{ marginBottom: '40px' }}>
                <div style={{ position: 'relative', width: '45%' }}>
                  <label htmlFor="">Cantidad <span style={{ color: 'red' }}>*</span></label>
                  <input
                    className="w-full bg-slate-800 border-0 border-b-2 border-blue-600 text-white px-4 py-2 my-2 outline-none"
                    style={{ width: '100%', padding: '5px' }}
                    type="text"
                    placeholder="Cantidad"
                    {...register(`repuestos.${index}.cantidad_repuesto`, NegativeRequired)}
                  />
                  {errors.repuestos && errors.repuestos[index] && errors.repuestos[index].cantidad_repuesto && (
                    <p className="text-red-500 mt-2" style={{ position: 'absolute', top: '80%', left: 0 }}>{errors.repuestos[index].cantidad_repuesto.message}</p>
                  )}
                </div>




                {/* INPUT DE PRECIO UNITARIO */}

                <div style={{ position: 'relative', width: '45%' }}>
                  <label htmlFor="">Precio Unitario <span style={{ color: 'red' }}>*</span></label>
                  <input
                    className="w-full bg-slate-800 border-0 border-b-2 border-blue-600 text-white px-4 py-2 my-2 outline-none"
                    style={{ width: '100%', padding: '5px' }}
                    type="text"
                    placeholder="Precio Unitario"

                    {...register(`repuestos.${index}.precio_unitario`, NegativeRequired)}
                  />

                  {errors.repuestos && errors.repuestos[index] && errors.repuestos[index].precio_unitario && (
                    <p className="text-red-500 mt-2" style={{ position: 'absolute', top: '80%', left: 0 }}>
                      {errors.repuestos[index].precio_unitario.message}</p>
                  )}

                </div>
              </div>

              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <button
                  type="submit"
                  className="noselect"
                  style={{ color: 'black', marginBottom: '10px' }}
                  disabled={availableRepuestos.length === 0} // Deshabilitar el botón si no hay repuestos disponibles
                >
                  <span className="text">Agregar</span>
                  <span className="icon">
                    <FontAwesomeIcon icon={faPlus} style={{ color: "white" }} />
                  </span>
                </button>

              </div>

            </div>
          ))}







          <div className="div2" style={{ height: '100px', marginTop: '5px' }}>

            <div className="tabla" style={{ maxWidth: '100%', overflowX: 'auto' }}>
              <MUIDataTable
                className="miTablaPersonalizada"
                title={"Repuestos Agregados"}
                data={repuestosList.map((repuesto) => {
                  // Convertir el precio unitario a número usando parseFloat
                  let precioUnitarioNumber = parseFloat(repuesto.precio_unitario);
                  let CantidadNumber = parseFloat(repuesto.cantidad_repuesto);

                  return {
                    repuesto: repuesto.repuesto.name,
                    marca: repuesto.repuesto.nombre_marca,
                    cantidad: formatCurrency2(CantidadNumber),
                    precioUnitario: formatCurrency(precioUnitarioNumber), // Asignar el número convertido
                    precioTotal: formatCurrency(repuesto.precio_total),

                  };
                })}

                columns={columnas2}
                options={{

                  sort: false,
                  responsive: 'standard',
                  rowsPerPage: 2,
                  rowsPerPageOptions: 3,
                  selectableRows: false,
                  print: false,
                  download: false,
                  viewColumns: false,

                  textLabels: {
                    body: {
                      noMatch: "No hay repuestos aún", // Aquí cambias el mensaje
                    },
                    toolbar: {
                      search: "Buscar",
                      filterTable: "Filtrar tabla",
                    },
                    pagination: {
                      displayRows: "de", // Cambia "of" por "de"
                      rowsPerPage: "Filas por página:",
                    },
                    filter: {
                      all: 'Todos',
                      title: 'Filtros',
                      reset: 'Reiniciar',

                    }
                  },
                }}
              />

              <style>{
                `

                // .tss-ynxllk-MUIDataTableFilter-root{
                //   background-color: #1e293b;
                // }
                .miTablaPersonalizada .tss-11quiee-MUIDataTable-paper{
                  background-color: #1e293b;
                }


                .miTablaPersonalizada .tss-1qtl85h-MUIDataTableBodyCell-root{
                  background-color: #1e293b;
                  color: white;
                  border-bottom-color: #2351b3;
                }

                .miTablaPersonalizada .tss-gm6zfk-MUIDataTableHeadCell-fixedHeader{
                  background-color: #1e293b;
                  color: white; 
                  border-bottom-color: #2351b3;
                  
                  
                  
                  
}

                .miTablaPersonalizada .css-rqglhn-MuiTable-root{
                  margin-top: 10px;
                  


                }

                // PRIMER CAJA DE LA TABLA
                .miTablaPersonalizada .tss-gm6zfk-MUIDataTableHeadCell-fixedHeaderr{
                  background-color: red; 
                  color: red;
                  
                }

                // ULTIMA CAJA DE LA TABLA
                .miTablaPersonalizada .tss-1ork7hi-MUIDataTablePagination-tableCellContainer{
                   background-color: red
                
                }


                .miTablaPersonalizada .tss-1ork7hi-MUIDataTablePagination-tableCellContainer{
                 
                  
                  padding: 10px;
                  background-color: #1e293b; 
                  
                  
                  border-bottom-color: #2351b3;
                  
                }

                .miTablaPersonalizada .MuiToolbar-gutters{
                  
                  // background-color: #93c5fd;
                   background-color: #1e293b;
                  color: white; 
                  
                }

                .miTablaPersonalizada .css-i4bv87-MuiSvgIcon-root{
                  color: white;
                }

                .miTablaPersonalizada .css-1x51dt5-MuiInputBase-input-MuiInput-input{
                  color: white;
                }



            

                // .miTablaPersonalizada .MuiToolbar-root{
                
                //   color: white;
                // }
                

                .miTablaPersonalizada .tss-1qjwhn0-MUIDataTableBody-emptyTitle{
                  color: white; 
                }

                .miTablaPersonalizada .tss-1cdcmys-MUIDataTable-responsiveBase{
                  background-color: #1e293b;
                }


                


                // NO HAY REPUESTOS AÚN
                .miTablaPersonalizada .MuiTypography-body1{
                  color: red;
                  
                }

                .miTablaPersonalizada {
                  background-color: #1e293b;
                  
                  border: 1px solid #2563eb
                  
              }

                
                `}</style>


            </div>
            <br />

            <div style={{ borderBottomColor: '1px solid white', padding: '5px', backgroundColor: '#12263a', borderRadius: '10px' }}>

              <h1 style={{ fontWeight: 'bold', textAlign: 'center' }}>Total Compra: <span style={{ color: '#93c5fd' }}>{formatCurrency(precioTotalCompra)}</span></h1>
            </div>



          </div>

          <div className="botones" style={{ marginTop: '20px' }}>
            <button
              type="button"
              className="px-5 py-1 mt-4 text-sm text-withe font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30"
              onClick={guardarCompra}
              disabled={repuestosList.length === 0 || errors.proveedorCompra || errors.codigo}
            >
              Guardar
            </button>
            <Link className="px-5 py-1 text-sm text-withe font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ml-5" to="/compras">Cancelar</Link>

          </div>
        </div>

        {/* ESTILOS DE CSS */}
        <style>


          {`

input[type="date"]::-webkit-calendar-picker-indicator {
background-color: white;
/* Otros estilos opcionales */
border-radius: 10px; /* Agrega esquinas redondeadas si lo deseas */
border: none; /* Quita el borde si no es necesario */
}




.noselect  {
width: 200px;
height: 50px;
cursor: pointer;
display: flex;
align-items: center;


border-radius: 5px;
box-shadow: 1px 1px 3px rgba(0,0,0,0.15);
background: #12263a;
}

.noselect, .noselect span {
transition: 200ms;
}

.noselect .text {
transform: translateX(50%);
color: white;
font-weight: bold;
}

.noselect .icon {

border-left: 1px solid black;
transform: translateX(50px);
height: 40px;
width: 100px;
display: flex;
align-items: center;
justify-content: center;
}

.noselect svg {
width: 15%;
fill: #eee;
}

.noselect:hover {
background: #12263;
}

.noselect:hover .text {
color: transparent;
}

.noselect:hover .icon {

width: 180px;
border-left: none;
margin-left: -100px

}

.noselect:focus {
outline: none;
}

.noselect:active .icon svg {
transform: scale(0.3);
}


.contenedorPrincipal {
  
  background-color: #374151;
  
  width: 100%;
  max-width: 2090px;
  height: 810px;
  margin-top: 2%;
  padding: 20px;
  box-sizing: border-box;
}

.divGris {
  border: 1px solid #2563eb;
  width: 50%;
  height: 550px;
  display: flex;
  flex-direction: column;
}

.greenContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  padding: 0 10px;
  position: relative;
  margin-bottom: 30px
}

.divBlanco {
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  padding: 0 10px;
  position: relative;
  margin-bottom: '100px
}

.divRojo {
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  padding: 0 10px;
}




  .div2{
    float: right;
    position: relative;
    
    bottom: 550px;
    width: 48%;
    
}




@media (max-width: 968px) {
  .contenedorPrincipal {
    height: 1210px;
    overflow-y: auto; /* Habilita el desplazamiento vertical solo en pantallas más pequeñas */
  }

  

 




  .div2{
    float: left;
    position: relative;
    
    width: 100%; 
    bottom: 290px
  }

  



  .divGris {
    width: 100%;
    margin-bottom: 300px
    
  }

  .greenContainer input,
  .greenContainer select,
  .divRojo select {
    width: 100%;
  }
}
`}

        </style>

      </form>


    </div>



) : (
  <Navigate to='/tasks' />
)}
</>
)
}
