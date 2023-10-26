import  Ventas_Servicios from "../models/ventas_servicios.model.js"
import  Cliente from "../models/cliente.model.js"
export const getVentas_Servicios = async(req, res) =>{
    const ventas_servicios = await Ventas_Servicios.find()
    if(!ventas_servicios) return res.status(404).json({message: "Venta_Servicios no encontrados"})
    res.json(ventas_servicios)

}

export const createVentas_Servicios = async (req, res) => {
    try {
        const { cliente: clienteId, precio_servicio, descripcion } = req.body;

        // Verifica si el cliente existe
        const clienteEncontrado = await Cliente.findById(clienteId);
        if (!clienteEncontrado) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        // Crea una nueva venta de servicio asociada al cliente
        const nuevaVentaServicio = new Ventas_Servicios({
            cliente: clienteEncontrado,
            precio_servicio,
            descripcion
        });

        // Guarda la venta de servicio en la base de datos
        const ventaServicioGuardada = await nuevaVentaServicio.save();

        res.status(201).json(ventaServicioGuardada);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la venta de servicio', error });
    }
};
  

export const deleteVentas_Servicios = async(req, res) =>{
    const ventas_servicios = await Ventas_Servicios.findByIdAndDelete(req.params.id)
    if(!ventas_servicios) return res.status(404).json({message: "ventas_servicios not found"})
    return res.sendStatus(204)
}

export const updateVentas_Servicios= async(req, res) =>{
    const ventas_servicios = await Ventas_Servicios.findByIdAndUpdate(req.params.id, req.body,{ // new y true son para que el guarde los datos nuevos que ingrese el usuario
        new: true
    })
    if(!ventas_servicios) return res.status(404).json({message: "ventas_servicios not found"})
    res.json(ventas_servicios)
}
