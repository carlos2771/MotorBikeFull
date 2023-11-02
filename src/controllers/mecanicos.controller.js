// Importa el modelo de datos 'Mecanicos' desde "../models/mecanicos.model.js"
import  Mecanico from "../models/mecanico.model.js"

// Obtiene todos los mecanicos
export const getMecanicos = async(req, res) =>{

    try {
        // Consulta todos los mecanicos en la base de datos
        const mecanicos = await Mecanico.find()

        // Si no se encuentran los mecanicos, devuelve un código de estado 404 y un mensaje de error
        if(!mecanicos) return res.status(404).json({message: "Mecanicos no encontrados"})

        // Devuelve los mecanicos encontrados en formato JSON
        res.json(mecanicos)
    }catch (error) {
        // En caso de error, maneja la excepción y devuelve un código de estado 500 (Error del servidor) con un mensaje de error
        res.status(500).json({ message: "Error al obtener los mecanicos", error: error.message });
        }
}

//Obtener un mecanico en especifico
export const getMecanico = async (req, res) => {
    try {
      // Consulta el mecanico en especifico en la base de datos por medio del id
      const mecanic = await Mecanico.findById(req.params.id);

      // Si no se encuentra el mecanico, devuelve un código de estado 404 y un mensaje de error
      if (!mecanic) return res.status(404).json({ message: "No se ha encontrado el mecanico" });

      // Devuelve el mecanico encontrado en formato JSON
      res.json(mecanic);

    } catch (error) {
        // En caso de error, maneja la excepción y devuelve un código de estado 500 (Error del servidor) con un mensaje de error
      return res.status(500).json({ message: "Mecanico no encontrado" });
    }
  };


// Crea un nuevo mecanico
export const createMecanico = async(req, res) =>{

    try {
        // Extrae los datos del mecanico, del cuerpo de la solicitud
        const  {nombre_mecanico, cedula_mecanico, telefono_mecanico, direccion_mecanico} = req.body

        // para saber cual es el usuario que viene de la otra coleccion pero debe estar logueado
        console.log(req.user) 

        // Crea una nueva instancia del modelo 'Mecanico' con los datos del mecanico
        const newMecanico = new Mecanico({
            nombre_mecanico, cedula_mecanico, telefono_mecanico, direccion_mecanico
        })

        // Guarda el nuevo mecanico en la base de datos
        const saveMecanico =  await newMecanico.save()

        // Devuelve el mecanico creado en formato JSON
        res.json(saveMecanico)
    }catch (error) {
        // En caso de error, maneja la excepción y devuelve un código de estado 500 (Error del servidor) con un mensaje de error
        res.status(500).json({ message: error.message }); 
      }
}

// Actualiza un mecanico por su ID
export const updateMecanico= async(req, res) =>{

    try {
        // Busca el mecanico por su ID y actualíza con los datos proporcionados en el cuerpo de la solicitud
        const mecanico = await Mecanico.findByIdAndUpdate(req.params.id, req.body,{

            // new y true son para que el guarde los datos nuevos que ingrese el usuario
            new: true
        })

        // Si el mecanico no se encuentra, devuelve un código de estado 404 y un mensaje de error
        if(!mecanico) return res.status(404).json({message: "Mecanico no encontrado"})

        // Devuelve el mecanico actualizado en formato JSON
        res.json(mecanico)
    } catch (error) {
        // En caso de error, maneja la excepción y devuelve un código de estado 500 (Error del servidor) con un mensaje de error
        return res.status(500).json({ message: "Error al actualizar el mecanico", error });
        }
}

// Elimina un mecanico por su ID
export const deleteMecanico = async(req, res) =>{
    
    try {
        // Busca el mecanico por su ID y lo elimina
        const mecanico = await Mecanico.findByIdAndDelete(req.params.id)

        // Si el mecanico no se encuentra, devuelve un código de estado 404 y un mensaje de error
        if(!mecanico) return res.status(404).json({message: "Mecanico no encontrado"})

        // Devuelve un código de estado 204 (Sin contenido) para indicar que el mecanico se eliminó con éxito
        return res.sendStatus(204)
    } catch (error) {
        // En caso de error, maneja la excepción y devuelve un código de estado 500 (Error del servidor) con un mensaje de error
        res.status(500).json({ message: "Error al eliminar cliente", error: error.message });
      }
}


