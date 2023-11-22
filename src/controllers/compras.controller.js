import Compras from "../models/compras.model.js"
import Repuesto from "../models/repuestos.model.js";

export const getCompras = async (req, res) => {
    try {
        const compras = await Compras.find().populate({ path: 'repuesto', select: 'nombre_repuesto' });
        if (!compras) {
            return res.status(404).json({ message: "Compras no encontrados" });
        }
        res.json(compras);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener compras", error });
    }
};

export const getCompra = async (req, res) => {
    try {
        const compra = await Compras.findById(req.params.id)
        if (!compra) {
            return res.status(404).json({ message: "Compra not found" });
        }
        res.json(compra);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener la compra", error });
    }
};

export const CreateCompras = async (req, res) => {
    try {
        const {
            repuesto: repuestoId,
            cantidadAcomprar,
            precio_unitario,
            precio_total,
            fecha
        } = req.body;

        // Verifica si el cliente existe
        // const clienteEncontrado = await Cliente.findById(clienteId);
        // if (!clienteEncontrado) {
        //     return res.status(404).json({ message: "Cliente no encontrado" });
        // }
        const repuestoEncontrado = await Repuesto.findById(repuestoId);
        if (!repuestoEncontrado) {
            return res.status(404).json({ message: "Repuesto no encontrado" });
        }
        // Obtiene la cantidad actual del repuesto
        const cantidadActualRepuesto = repuestoEncontrado.cantidad;

        // Verifica si hay suficiente cantidad disponible del repuesto
        if (cantidadActualRepuesto < cantidad_repuesto) {
            return res.status(400).json({ message: ["Cantidad insuficiente del repuesto"] });
        }

        // Resta la cantidad vendida de la cantidad actual del repuesto
        const cantidadRestanteRepuesto = cantidadActualRepuesto - cantidad_repuesto;
        await Repuesto.findByIdAndUpdate(repuestoId, { cantidad: cantidadRestanteRepuesto });

        // Crea una nueva venta de servicio asociada al cliente
        const nuevaVentaRepuesto = new Ventas_Repuestos({
            repuesto: repuestoId,
            cantidadAcomprar,
            cantidad_repuesto,
            precio_unitario,
            precio_total,
            fecha
        });

        // Guarda la venta de servicio en la base de datos
        const compraGuardada = await nuevaCompra.save();

        res.status(201).json(compraGuardada);
    } catch (error) {
        return res.status(500).json({ message: "Error al crear la compra", error });
    }
};


export const updateCompras = async (req, res) => {
    try {
        const compra = await Compras.findByIdAndUpdate(
            req.params.id,
            { anulado: true },
            { new: true }
        );

        if (!compra) {
            return res.status(404).json({ message: "Compra no encontrada" });
        }

        // Restaurar la cantidad de repuestos en el documento "Repuestos"
        const repuesto = await Repuesto.findById(compra.repuesto);
        if (repuesto) {
            const cantidadRestanteRepuesto =
                repuesto.cantidad + compra.cantidadAcomprar;
            await Repuesto.findByIdAndUpdate(compra.repuesto, {
                cantidad: cantidadRestanteRepuesto,
            });
        }

        res.json(compra);
    } catch (error) {
        return res.status(500).json({ message: "Error al anular la compra", error });
    }
};

export const deleteCompras = async (req, res) => {
    try {
        const deletedCompra = await Compras.findByIdAndDelete(req.params.id);
        if (!deletedCompra)
            return res.status(404).json({ message: "Compra not found" });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}