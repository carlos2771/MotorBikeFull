import { axiosMecanico } from "./axiosInstance";

//Esta función realiza una solicitud GET a la ruta /mecanicos utilizando la instancia de Axios axiosMecanico.
export const getMecanicosRequest = async () => {
  const response = await axiosMecanico.get("/mecanicos");
  return response.data;//Después de recibir la respuesta, la función devuelve los datos de respuesta 
};

//Esta función toma un parámetro id, el identificador de un mecánico.
//Realiza una solicitud GET a la ruta /mecanicos/{id} donde {id} se reemplaza por el parámetro id.
export const getMecanicoRequest = async (id) => {
  const response = await axiosMecanico.get(`/mecanicos/${id}`);
  return response.data;//Después de recibir la respuesta, la función devuelve los datos de respuesta 
};

// Esta función toma un objeto "mecanico" como parámetro, que representa la información de un nuevo mecánico que se va a crear.
// Realiza una solicitud POST a la ruta /mecanicos con el cuerpo de la solicitud configurado como el objeto mecanico.
export const createMecanicosRequest = async (mecanico) => {
  const response = await axiosMecanico.post("/mecanicos", mecanico);
  return response.data; //Después de recibir la respuesta, la función devuelve los datos de respuesta 
};

// Esta función toma dos parámetros: id, el identificador del mecánico que se va a actualizar, y mecanico, que es un objeto que contiene la información actualizada del mecánico.
// Realiza una solicitud PUT a la ruta /mecanicos/{id}, donde {id} se reemplaza por el parámetro id, y el cuerpo de la solicitud se configura con el objeto mecanico.
export const updateMecanicosRequest = async (id, mecanico) => {
  const response = await axiosMecanico.put(`/mecanicos/${id}`,mecanico);
  return response.data; //Después de recibir la respuesta, la función devuelve los datos de respuesta 
};

// Esta función toma un parámetro id, el identificador del mecánico que se va a eliminar.
// Realiza una solicitud DELETE a la ruta /mecanicos/{id}, donde {id} se reemplaza por el el parámetro id.
export const deleteMecanicosRequest = async (id) => {
  const response = await axiosMecanico.delete(`/mecanicos/${id}`);
  return response; //Devuelve la respuesta de la solicitud sin procesar, que indicará el éxito o el fracaso de la eliminación.
};
