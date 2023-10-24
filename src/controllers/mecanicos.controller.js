// Importa el modelo de datos 'Mecanicos' desde "../models/mecanicos.model.js"
import  Mecanico from "../models/mecanico.model.js"

// Obtiene todos los clientes
export const getMecanico = async(req, res) =>{
    // Consulta todos los mecanicos en la base de datos
    const mecanicos = await Mecanico.find()

    // Si no se encuentran los mecanicos, devuelve un código de estado 404 y un mensaje de error
    if(!mecanicos) return res.status(404).json({message: "Mecanicos no encontrados"})

    // Devuelve los mecanicos encontrados en formato JSON
    res.json(mecanicos)
}

// Crea un nuevo mecanico
export const createMecanico = async(req, res) =>{
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
}

// Actualiza un mecanico por su ID
export const updateMecanico= async(req, res) =>{

    // Busca el mecanico por su ID y actualíza con los datos proporcionados en el cuerpo de la solicitud
    const mecanico = await Mecanico.findByIdAndUpdate(req.params.id, req.body,{

        // new y true son para que el guarde los datos nuevos que ingrese el usuario
        new: true
    })

    // Si el mecanico no se encuentra, devuelve un código de estado 404 y un mensaje de error
    if(!mecanico) return res.status(404).json({message: "Mecanico no encontrado"})

    // Devuelve el mecanico actualizado en formato JSON
    res.json(mecanico)
}

// Elimina un mecanico por su ID
export const deleteMecanico = async(req, res) =>{
    
    // Busca el mecanico por su ID y lo elimina
    const mecanico = await Mecanico.findByIdAndDelete(req.params.id)

    // Si el mecanico no se encuentra, devuelve un código de estado 404 y un mensaje de error
    if(!mecanico) return res.status(404).json({message: "Mecanico no encontrado"})

     // Devuelve un código de estado 204 (Sin contenido) para indicar que el mecanico se eliminó con éxito
    return res.sendStatus(204)
}


