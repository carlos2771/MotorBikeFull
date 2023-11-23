import Compras from "../models/compras.model.js"
import Repuesto from "../models/repuestos.model.js";

export const getCompras = async (req, res) => {
  try {
    const compras = await Compras.find().populate({ path: 'repuesto', select: 'nombre_repuesto' });
    if (!compras) {
      return res.status(404).json({ message: "Compras no encontradas" });
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
      return res.status(404).json({ message: "Compra no encontrada" });
    }
    res.json(compra);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener la compra", error });
  }
};

export const createCompras = async (req, res) => {
  try {
    const {
      repuesto: repuestoId,
      cantidad_repuesto,
      precio_unitario,
      precio_total,
      fecha,
    } = req.body;

 
    const repuestoEncontrado = await Repuesto.findById(repuestoId);
    if (!repuestoEncontrado) {
      return res.status(404).json({ message: "Repuesto no encontrado" });
    }
    // Obtiene la cantidad actual del repuesto
    const cantidadActualRepuesto = repuestoEncontrado.cantidad;
  
    // // Verifica si hay suficiente cantidad disponible del repuesto
    // if (cantidadActualRepuesto < cantidad_repuesto) {
    //   return res.status(400).json({ message: ["Cantidad insuficiente del repuesto"] });
    // }

    // Suma la cantidad vendida de la cantidad actual del repuesto
    const cantidadRestanteRepuesto = cantidadActualRepuesto + cantidad_repuesto;
    await Repuesto.findByIdAndUpdate(repuestoId, { cantidad: cantidadRestanteRepuesto });

    // Crea una nueva compra
    const nuevaCompra = new Compras({
      repuesto: repuestoId,
      cantidad_repuesto,
      precio_unitario,
      precio_total,
      fecha,
      estado
    });

    // Guarda la compra en la base de datos
    const compraGuardada = await nuevaCompra.save();

    res.status(201).json(compraGuardada);
  } catch (error) {
    return res.status(500).json({ message: "Error al crear la compra", error });
  }
};


export const updateCompras= async(req, res) =>{
  try {
    const compra = await Compras.findByIdAndUpdate(req.params.id, req.body, {
      // new y true son para que el guarde los datos nuevos que ingrese el usuario
      new: true,
    });
    if (!compra) return res.status(404).json({ message: "Compra no encontrada" });
    res.json(compra);
  } catch (error) {
    return res.status(500).json({ message: "Compra no encontrada" });
  }
}

export const deleteCompras  = async(req, res) =>{
  try {
    const deletedCompra = await Compras.findByIdAndDelete(req.params.id);
    if (!deletedCompra)
      return res.status(404).json({ message: "Compra no encontrada" });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}