import Repuesto from "../models/repuestos.model.js";
import Marca from "../models/marca.model.js";

export const getRepuestos = async (req, res) => {
    try {
        const repuestos = await Repuesto.find().populate({ path: 'marca', select: 'nombre_marca' })
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

        // Verifica si el cliente existe
        // const clienteEncontrado = await Cliente.findById(clienteId);
        // if (!clienteEncontrado) {
        //     return res.status(404).json({ message: "Cliente no encontrado" });
        // }

        // MARCA:
        const marcaEncontrada = await Marca.findById(marcaId);
        if (!marcaEncontrada) {
            return res.status(404).json({ message: "Marca no encontrada" });
        }
        // Obtiene la cantidad actual del repuesto
        // const cantidadActualRepuesto = repuestoEncontrado.cantidad;

        // Verifica si hay suficiente cantidad disponible del repuesto
        // if (cantidadActualRepuesto < cantidad_repuesto) {
        //     return res.status(400).json({ message: ["Cantidad insuficiente del repuesto"] });
        // }

        // Resta la cantidad vendida de la cantidad actual del repuesto
        // const cantidadRestanteRepuesto = cantidadActualRepuesto - cantidad_repuesto;
        // await Repuesto.findByIdAndUpdate(repuestoId, { cantidad: cantidadRestanteRepuesto });

        // Crea una nueva venta de servicio asociada al cliente
        const nuevoRepuesto = new Repuesto({
            nombre_repuesto,
            marca: marcaId,
            cantidad,
            precio,
            estado
        });

        // Guarda la venta de servicio en la base de datos
        const repuestoGuardado = await nuevoRepuesto.save();

        res.status(201).json(repuestoGuardado);
    } catch (error) {
        return res.status(500).json({ message: "Error al crear el repuesto", error });
    }
};



export const updateRepuestos = async (req, res) => {
    try {
        const repuesto = await Repuesto.findByIdAndUpdate(req.params.id, req.body, {
            // new y true son para que el guarde los datos nuevos que ingrese el usuario
            new: true,
        });
        if (!repuesto) return res.status(404).json({ message: "repuesto not found" });
        res.json(repuesto);
    } catch (error) {
        return res.status(500).json({ message: "repuesto no encontrado" });
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