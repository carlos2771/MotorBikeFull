// Importa el modelo de datos 'Mecanico' desde "../models/clientes.model.js"
import  Mecanico from "../models/mecanico.model.js"

// Obtiene todos los clientes
export const getMecanicos = async(req, res) =>{
    try {
        // Consulta todos los mecanicos en la base de datos
        const mecanicos = await Mecanico.find().sort({createdAt : 'desc'})

        // Si no se encuentran los mecanicos, devuelve un código de estado 404 y un mensaje de error
        if(!mecanicos){
            return res.status(404).json({ message: "Mecanicos no encontrados" });
          }

        // Devuelve los mecanicos encontrados en formato JSON
        res.json(mecanicos)
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener los mecanicos", error });
    }

}

export const getMecanico = async (req, res) => {
    try {
      const mecanico = await Mecanico.findById(req.params.id)
      if (!mecanico) {
        return res.status(404).json({ message: "Mecanico no encontrado" });
      }
      res.json(mecanico);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener el mecanico", error });
    }
  };


// Crea un nuevo mecanico
export const createMecanico = async (req, res) => {
    try {
        const { nombre_mecanico, cedula_mecanico, telefono_mecanico, direccion_mecanico, estado, tipo } = req.body;

        // Verifica si la cédula ya está registrada para cualquier tipo de documento
        const cedulaFound = await Mecanico.findOne({ cedula_mecanico });

        if (cedulaFound) {
            // Si la cédula existe, verifica si el tipo de documento coincide
            if (cedulaFound.tipo === tipo) return res.status(400).json({ message: ["Ya existe un mecánico con este número de cédula y tipo de documento." ]});
            
        }

        // Crea una nueva instancia del modelo 'Mecanico' con los datos del mecánico
        const newMecanico = new Mecanico({
            nombre_mecanico, cedula_mecanico, telefono_mecanico, direccion_mecanico, estado,
            tipo
        });

        // Guarda el nuevo mecánico en la base de datos
        const saveMecanico = await newMecanico.save();

        // Devuelve el mecánico creado en formato JSON
        res.status(201).json(saveMecanico);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualiza un mecanico por su ID
export const updateMecanico= async(req, res) =>{
    try {
        // Busca el mecanico por su ID y actualíza con los datos proporcionados en el cuerpo de la solicitud
        const mecanico = await Mecanico.findByIdAndUpdate(req.params.id, req.body,{
            // new y true son para que el guarde los datos nuevos que ingrese el usuario
            new: true
        });
        // Si el mecanico no se encuentra, devuelve un código de estado 404 y un mensaje de error
        if(!mecanico) return res.status(404).json({message: "Mecanico no encontrado"});

        // Devuelve el mecanico actualizado en formato JSON
        res.json(mecanico);
    } catch (error) {
        return res.status(500).json({ message: " Error al actualizar el mecanico", error });
  }
};

// Elimina un mecanico por su ID
export const deleteMecanico = async(req, res) =>{
    try {
        // Busca el mecanico por su ID y lo elimina
        const deletedMecanico = await Mecanico.findByIdAndDelete(req.params.id)

        // Si el mecanico no se encuentra, devuelve un código de estado 404 y un mensaje de error
        if(!deletedMecanico) return res.status(404).json({message: "Mecanico no encontrado"})

        // Devuelve un código de estado 204 (Sin contenido) para indicar que el mecanico se eliminó con éxito
        return res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}