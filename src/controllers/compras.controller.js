import Compra from "../models/compras.model.js"
import Repuesto from "../models/repuestos.model.js";

export const getCompras = async (req, res) => {
  try {
    const compras = await Compra.find().populate({ path: 'repuesto', select: 'nombre_repuesto' });
    if (!compras) {
      return res.status(404).json({ message: "compras no encontradas" });
    }
    res.json(compras);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener las compras", error });
  }
};

export const getCompra = async (req, res) => {
  try {
    const compra = await Compra.findById(req.params.id)
    if (!compra) {
      return res.status(404).json({ message: "compra not found" });
    }
    res.json(compra);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener la compra", error });
  }
};

export const createCompra = async (req, res) => {
  try {
    const {
      repuesto: repuestoId,
      cantidad,
      precio_unitario,
      precio_total,
      fecha,
      estado
    } = req.body;

    // Verifica si el cliente existe
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

    //SUMA LA CANTIDAD
    // Resta la cantidad vendida de la cantidad actual del repuesto
    const cantidadRestanteRepuesto = cantidadActualRepuesto + cantidad_repuesto;
    await Repuesto.findByIdAndUpdate(repuestoId, { cantidad: cantidadRestanteRepuesto });

    // Crea una nueva venta de servicio asociada al cliente
    const nuevaCompra = new Compra({
      repuesto: repuestoId,
      cantidad,
      precio_unitario,
      precio_total,
      fecha,
      estado
    });

    // Guarda la venta de servicio en la base de datos
    const compraGuardada = await nuevaCompra.save();

    res.status(201).json(compraGuardada);
  } catch (error) {
    return res.status(500).json({ message: "Error al crear la compra", error });
  }
};


export const updateCompra = async (req, res) => {
  try {
    const compra = await Compra.findByIdAndUpdate(req.params.id, req.body, {
      // new y true son para que el guarde los datos nuevos que ingrese el usuario
      new: true,
    });
    if (!compra) return res.status(404).json({ message: "compra not found" });
    res.json(compra);
  } catch (error) {
    return res.status(500).json({ message: "compra no encontrada" });
  }
}

export const deleteCompra = async (req, res) => {
  try {
    const deletedCompra = await Compra.findByIdAndDelete(req.params.id);
    if (!deletedCompra)
      return res.status(404).json({ message: "compra  not found" });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}