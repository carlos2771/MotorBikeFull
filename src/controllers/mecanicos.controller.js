// Importa el modelo de datos 'Mecanico' desde "../models/clientes.model.js"
import Mecanico from "../models/mecanico.model.js"

// Obtiene todos los clientes
export const getMecanicos = async (req, res) => {
    try {
        // Consulta todos los mecanicos en la base de datos
        const mecanicos = await Mecanico.find().sort({ createdAt: 'desc' })

        // Si no se encuentran los mecanicos, devuelve un código de estado 404 y un mensaje de error
        if (!mecanicos) {
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



export const createMecanico = async (req, res) => {
    try {
        const { nombre_mecanico, cedula_mecanico, telefono_mecanico, direccion_mecanico, estado, tipo } = req.body;

        // Verificar si el número de cédula ya existe con el mismo tipo de documento
        const existingMecanico = await Mecanico.findOne({ cedula_mecanico, tipo });

        if (existingMecanico) {
            return res.status(400).json({ message: ["Ya existe un mecánico con este número de cédula y tipo de documento." ]});
        }

        // Crear una nueva instancia del modelo 'Mecanico' con los datos del mecánico
        const newMecanico = new Mecanico({
            nombre_mecanico, cedula_mecanico, telefono_mecanico, direccion_mecanico, estado, tipo
        });

        // Guardar el nuevo mecánico en la base de datos
        const savedMecanico = await newMecanico.save();

        res.status(201).json(savedMecanico);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el mecánico", error });
    }
}

// Actualiza un mecanico por su ID
export const updateMecanico = async (req, res) => {
    try {
        // Extrae los datos a actualizar del cuerpo de la solicitud
        const { nombre_mecanico, cedula_mecanico, telefono_mecanico, direccion_mecanico, estado, tipo } = req.body;

        // Busca el mecanico por su ID
        const mecanico = await Mecanico.findById(req.params.id);
        // Si el mecanico no se encuentra, devuelve un código de estado 404 y un mensaje de error
        if (!mecanico) return res.status(404).json({ message: "Mecanico no encontrado" });
        
        // Verificar si existe otro mecánico con el mismo número de cédula y tipo de documento
        const existingMecanico = await Mecanico.findOne({ cedula_mecanico, tipo });

        // Si encontramos otro mecánico con la misma cédula y tipo de documento, y su ID no es el mismo que estamos actualizando,
        // entonces no permitimos la actualización y devolvemos un mensaje de error.
        if (existingMecanico && existingMecanico._id.toString() !== req.params.id) {
            return res.status(400).json({ message: ["Ya existe un mecánico con este número de cédula y tipo de documento." ]});
        }

        // Actualiza el mecanico con los datos proporcionados
        const updatedMecanico = await Mecanico.findByIdAndUpdate(req.params.id, {
            nombre_mecanico,
            cedula_mecanico,
            telefono_mecanico,
            direccion_mecanico,
            estado,
            tipo
        }, {
            new: true // Devuelve el documento actualizado
        });

        // Devuelve el mecanico actualizado en formato JSON
        res.json(updatedMecanico);
    } catch (error) {
        return res.status(500).json({ message: ["Error al actualizar el mecánico"], error });
    }
};



// Elimina un mecanico por su ID
export const deleteMecanico = async (req, res) => {
    try {
        // Busca el mecanico por su ID y lo elimina
        const deletedMecanico = await Mecanico.findByIdAndDelete(req.params.id)

        // Si el mecanico no se encuentra, devuelve un código de estado 404 y un mensaje de error
        if (!deletedMecanico) return res.status(404).json({ message: "Mecanico no encontrado" })

        // Devuelve un código de estado 204 (Sin contenido) para indicar que el mecanico se eliminó con éxito
        return res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}