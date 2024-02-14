import Ventas_Repuestos from "../models/ventas_repuestos.model.js"
import Repuesto from "../models/repuestos.model.js";
import Cliente from "../models/cliente.model.js";

export const getVentas_Repuestos = async (req, res) => {
  try {
    const ventas_repuestos = await Ventas_Repuestos.find().populate({ path: 'cliente', select: 'nombre_cliente' }) .populate({ path: 'repuestos.repuesto', select: 'nombre_repuesto' });
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
    const { repuestos, cliente: clienteId, precio_total } = req.body;
    console.log("Request Body (backend):", req.body);
    // Verifica si el cliente existe
    const clienteEncontrado = await Cliente.findById(clienteId);
    if (!clienteEncontrado) {
      return res.status(404).json({ message: ["Cliente no encontrado"] });
    }
    const camposFaltantes = [];
    if (!repuestos) camposFaltantes.push("repuestos");
    if (!clienteId) camposFaltantes.push("cliente");
    if (!precio_total) camposFaltantes.push("precio_total");

    if (camposFaltantes.length > 0) {
      const mensajeError = `Los siguientes campos son obligatorios: ${camposFaltantes.join(", ")}`;
      return res.status(400).json({ message: [mensajeError] });
    }

    console.log("precio_total:", precio_total);
    // Realiza las validaciones y actualizaciones para cada repuesto en la lista
    for (const repuestoData of repuestos) {
      const repuestoEncontrado = await Repuesto.findById(repuestoData.repuesto);
      if (!repuestoEncontrado) {
        return res.status(404).json({ message: ["Repuesto no encontrado"] });
      }

      const cantidadActualRepuesto = repuestoEncontrado.cantidad;
      const cantidadVender = repuestoData.cantidad_vender;

      if (cantidadActualRepuesto < cantidadVender) {
        return res.status(400).json({ message: ["Cantidad insuficiente del repuesto"] });
      }

      const cantidadRestanteRepuesto = cantidadActualRepuesto - cantidadVender;
      await Repuesto.findByIdAndUpdate(repuestoData.repuesto, { cantidad: cantidadRestanteRepuesto });
    }
    
    // Crea la venta de repuestos asociada al cliente
    const nuevaVentaRepuestos = new Ventas_Repuestos({
      repuestos,
      cliente: clienteId,
      precio_total
    });

    // Guarda la venta de repuestos en la base de datos
    const ventaRepuestosGuardada = await nuevaVentaRepuestos.save();

    res.status(201).json(ventaRepuestosGuardada);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: ["Error al crear la venta de repuestos"], error });
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