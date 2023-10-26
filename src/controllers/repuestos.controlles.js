// Importa el modelo de datos 'Mecanicos' desde "../models/mecanicos.model.js"
import Repuesto from "../models/repuestos.model.js"

// Obtiene todos los clientes
export const getRepuesto = async (req, res) => {
    // Consulta todos los mecanicos en la base de datos
    const repuestos = await Repuesto.find()

    // Si no se encuentran los mecanicos, devuelve un código de estado 404 y un mensaje de error
    if (!repuestos) return res.status(404).json({ message: "Repuestos no encontrados" })

    // Devuelve los mecanicos encontrados en formato JSON
    res.json(repuestos)
}

// Crea un nuevo mecanico

export const createRepuesto = async (req, res) => {
    try {
        const { nombre_repuesto, cantidad, precio } = req.body;
        console.log(req.user); // para saber cual es el usuario que viene de la otra coleccion pero debe estar logueado
        const newRepuesto = new Repuesto({
            nombre_repuesto, cantidad, precio
        });
        const saveRepuesto = await newRepuesto.save();
        res.json(saveRepuesto);
    } catch (error) {
        return res.status(500).json({ message: "Repuesto no encontrado" });
    }
};

// Actualiza un mecanico por su ID
export const updateRepuesto = async (req, res) => {

    // Busca el mecanico por su ID y actualíza con los datos proporcionados en el cuerpo de la solicitud
    const repuesto = await Repuesto.findByIdAndUpdate(req.params.id, req.body, {

        // new y true son para que el guarde los datos nuevos que ingrese el usuario
        new: true
    })

    // Si el mecanico no se encuentra, devuelve un código de estado 404 y un mensaje de error
    if (!repuesto) return res.status(404).json({ message: "Repuesto no encontrado" })

    // Devuelve el mecanico actualizado en formato JSON
    res.json(repuesto)
}

// Elimina un mecanico por su ID
export const deleteRepuesto = async (req, res) => {

    // Busca el mecanico por su ID y lo elimina
    const repuesto = await Repuesto.findByIdAndDelete(req.params.id)

    // Si el mecanico no se encuentra, devuelve un código de estado 404 y un mensaje de error
    if (!repuesto) return res.status(404).json({ message: "Repuesto no encontrado" })

    // Devuelve un código de estado 204 (Sin contenido) para indicar que el mecanico se eliminó con éxito
    return res.sendStatus(204)
}


