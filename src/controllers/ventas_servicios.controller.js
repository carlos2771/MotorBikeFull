import  Ventas_Servicios from "../models/ventas_servicios.model.js"
import Mecanico from "../models/mecanico.model.js"
import  Cliente from "../models/cliente.model.js"

export const getVentas_Servicios = async (req, res) => {
    try {
      const ventas_servicios = await Ventas_Servicios.find().populate({ path: 'cliente', select: 'nombre_cliente' }).populate({ path: 'mecanico', select: 'nombre_mecanico' });
      if (!ventas_servicios) {
        return res.status(404).json({ message: "Venta_servicios no encontrados" });
      }
      res.json(ventas_servicios);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener ventas de servicios", error });
    }
  };

  export const getVenta_Servicio = async (req, res) => {
    try {
      const venta_servicio = await Ventas_Repuestos.findById(req.params.id).populate({ path: 'cliente', select: 'nombre_cliente' }).populate({ path: 'mecanico', select: 'nombre_mecanico' });
      if (!venta_servicio) {
        return res.status(404).json({ message: "venta_servicio not found" });
      }
      res.json(venta_servicio);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener la venta de servicio", error });
    }
  };

export const createVentas_Servicios = async (req, res) => {
    try {
        const {
            mecanico: mecanicoId,
            cliente: clienteId,
            precio_servicio,
            descripcion 
        } = req.body;

        // Verifica si el cliente existe
    const clienteEncontrado = await Cliente.findById(clienteId);
    if (!clienteEncontrado) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    //verifica si el mecanico existe
    const mecanicoEncontrado = await Mecanico.findById(mecanicoId);
    if (!mecanicoEncontrado) {
      return res.status(404).json({ message: "Mecanico no encontrado" });
    }

        // Crea una nueva venta de servicio asociada al cliente
    const nuevaVentaServicio = new Ventas_Servicios({
        mecanico: mecanicoId,
        cliente: clienteId,
        precio_servicio,
        descripcion
        });

        // Guarda la venta de servicio en la base de datos
        const ventaServicioGuardada = await nuevaVentaServicio.save();

        res.status(201).json(ventaServicioGuardada);
  } catch (error) {
    return res.status(500).json({ message: "Error al crear la venta de servicio", error });
  }
};
  
export const updateVentas_Servicios= async(req, res) =>{
    try {
      const venta_servicio = await Ventas_Servicios.findByIdAndUpdate(req.params.id, req.body, {
        // new y true son para que el guarde los datos nuevos que ingrese el usuario
        new: true,
      });
      if (!venta_servicio) return res.status(404).json({ message: "venta servicio not found" });
      res.json(venta_servicio);
    } catch (error) {
      return res.status(500).json({ message: "venta servicio no encontrada" });
    }
  }

  export const deleteVentas_Servicios = async(req, res) =>{
    try {
      const deletedVenta_servicio = await Ventas_Repuestos.findByIdAndDelete(req.params.id);
      if (!deletedVenta_servicio)
        return res.status(404).json({ message: "Venta  not found" });
      return res.sendStatus(204);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }