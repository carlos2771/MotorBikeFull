import Ventas_Repuestos from "../models/ventas_repuestos.model.js"
import Repuesto from "../models/repuestos.model.js";
import Cliente from "../models/cliente.model.js";

export const getVentas_Repuestos = async (req, res) => {
  try {
    const ventas_repuestos = await Ventas_Repuestos.find().populate({ path: 'cliente', select: 'nombre_cliente' }) .populate({ path: 'repuesto', select: 'nombre_repuesto' });
    if (!ventas_repuestos) {
      return res.status(404).json({ message: "Venta_Repuestos no encontrados" });
    }
    res.json(ventas_repuestos);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener ventas de repuestos", error });
  }
};

export const getVenta_Repuesto = async (req, res) => {
  try {
    const venta_repuesto = await Ventas_Repuestos.findById(req.params.id)
    if (!venta_repuesto) {
      return res.status(404).json({ message: "venta_repuesto not found" });
    }
    res.json(venta_repuesto);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener la venta de repuesto", error });
  }
};

export const createVentas_Repuestos = async (req, res) => {
  try {
    const {
      repuesto: repuestoId,
      cantidad_repuesto,
      precio_unitario,
      precio_total,
      cliente: clienteId,
      estado
    } = req.body;

    // Verifica si el cliente existe
    const clienteEncontrado = await Cliente.findById(clienteId);
    if (!clienteEncontrado) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
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
      cantidad_repuesto,
      precio_unitario,
      precio_total,
      cliente: clienteId,
      estado
    });

    // Guarda la venta de servicio en la base de datos
    const ventaRepuestoGuardada = await nuevaVentaRepuesto.save();

    res.status(201).json(ventaRepuestoGuardada);
  } catch (error) {
    return res.status(500).json({ message: "Error al crear la venta de repuesto", error });
  }
};


export const updateVentas_Repuestos = async (req, res) => {
  try {
    const venta_repuesto = await Ventas_Repuestos.findByIdAndUpdate(
      req.params.id,
      { anulado: true },
      { new: true }
    );

    if (!venta_repuesto) {
      return res.status(404).json({ message: "Venta repuesto no encontrada" });
    }

    // Restaurar la cantidad de repuestos en el documento "Repuestos"
    const repuesto = await Repuesto.findById(venta_repuesto.repuesto);
    if (repuesto) {
      const cantidadRestanteRepuesto =
        repuesto.cantidad + venta_repuesto.cantidad_repuesto;
      await Repuesto.findByIdAndUpdate(venta_repuesto.repuesto, {
        cantidad: cantidadRestanteRepuesto,
      });
    }

    res.json(venta_repuesto);
  } catch (error) {
    return res.status(500).json({ message: "Error al anular la venta de repuesto", error });
  }
};

export const deleteVentas_Repuestos = async(req, res) =>{
  try {
    const deletedVenta_repuesto = await Ventas_Repuestos.findByIdAndDelete(req.params.id);
    if (!deletedVenta_repuesto)
      return res.status(404).json({ message: "Venta  not found" });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}