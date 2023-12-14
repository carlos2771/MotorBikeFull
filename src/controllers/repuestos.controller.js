import Repuesto from "../models/repuestos.model.js";
import Marca from "../models/marca.model.js";

export const getRepuestos = async (req, res) => {
    try {
        const repuestos = await Repuesto.find().populate({ path: 'marca', select: 'nombre_marca' }).sort({nombre_repuesto:'desc'});
        if (!repuestos) {
            return res.status(404).json({ message: "repuestos no encontrados" });
        }
        res.json(repuestos);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener repuestos", error });
    }
};

export const getRepuesto = async (req, res) => {
    try {
        const repuesto = await Repuesto.findById(req.params.id)
        if (!repuesto) {
            return res.status(404).json({ message: "repuesto not found" });
        }
        res.json(repuesto);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener el repuesto", error });
    }
};

export const createRepuestos = async (req, res) => {
    try {
        const {
            nombre_repuesto,
            marca: marcaId,
            cantidad,
            precio,
            estado
        } = req.body;

        // Convertir la cantidad a un número (puedes ajustar esto según tus necesidades)
        const cantidadNumerica = parseInt(cantidad, 10);

        // Verificar si ya existe un repuesto con el mismo nombre y marca
        const repuestoExistente = await Repuesto.findOne({ nombre_repuesto, marca: marcaId });

        if (repuestoExistente) {
            // Si existe, actualiza la cantidad
            repuestoExistente.cantidad += cantidadNumerica;
            await repuestoExistente.save();

            return res.status(200).json(repuestoExistente);
        }

        // Si no existe, crea un nuevo repuesto
        const marcaEncontrada = await Marca.findById(marcaId);
        if (!marcaEncontrada) {
            return res.status(404).json({ message: "Marca no encontrada" });
        }

        const nuevoRepuesto = new Repuesto({
            nombre_repuesto,
            marca: marcaId,
            cantidad: cantidadNumerica,
            precio,
            estado
        });

        const repuestoGuardado = await nuevoRepuesto.save();

        res.status(201).json(repuestoGuardado);
    } catch (error) {
        return res.status(500).json({ message: "Error al crear el repuesto", error });
    }
};


export const updateRepuestos = async (req, res) => {
    try {
        const {
            nombre_repuesto,
            marca: marcaId,
            cantidad
        } = req.body;

        // Convertir la cantidad a un número (puedes ajustar esto según tus necesidades)
        const cantidadNumerica = parseInt(cantidad, 10);

        // Verificar si ya existe un repuesto con el mismo nombre y marca
        const repuestoExistente = await Repuesto.findOne({ nombre_repuesto, marca: marcaId });

        if (repuestoExistente) {
            // Si existe, actualiza la cantidad
            repuestoExistente.cantidad += cantidadNumerica;
            await repuestoExistente.save();

            // Ahora, puedes actualizar otras propiedades si es necesario
            const repuestoActualizado = await Repuesto.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });

            return res.status(200).json(repuestoActualizado);
        }

        // Si no existe, realiza la actualización normal
        const repuestoActualizado = await Repuesto.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!repuestoActualizado) {
            return res.status(404).json({ message: "Repuesto no encontrado" });
        }

        res.json(repuestoActualizado);
    } catch (error) {
        return res.status(500).json({ message: "Error al actualizar el repuesto", error });
    }
};



export const deleteRepuesto = async (req, res) => {
    try {
        const deletedRepuesto = await Repuesto.findByIdAndDelete(req.params.id);
        if (!deletedRepuesto)
            return res.status(404).json({ message: "repuesto not found" });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}