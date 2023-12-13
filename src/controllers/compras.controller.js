import Compras from "../models/compras.model.js";
import Repuesto from "../models/repuestos.model.js";

export const getCompras = async (req, res) => {
  try {
    const compras = await Compras.find().populate({ path: 'repuestos.repuesto', select: 'nombre_repuesto' }).sort({createdAt:'desc'});
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
    const compra = await Compras.findById(req.params.id);
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
    const { repuestos, fecha, estado } = req.body;

    // Verifica si hay repuestos proporcionados en la solicitud
    if (!repuestos || repuestos.length === 0) {
      return res.status(400).json({ message: "Debe proporcionar al menos un repuesto" });
    }

    // Verifica la existencia de cada repuesto y actualiza la cantidad en la base de datos
    for (const repuestoInfo of repuestos) {
      const { repuesto: repuestoId, cantidad_repuesto } = repuestoInfo;
      const repuestoEncontrado = await Repuesto.findById(repuestoId);

      if (!repuestoEncontrado) {
        return res.status(404).json({ message: `Repuesto con ID ${repuestoId} no encontrado` });
      }

      const cantidadRestanteRepuesto = repuestoEncontrado.cantidad + parseInt(cantidad_repuesto);
      await Repuesto.findByIdAndUpdate(repuestoId, { cantidad: cantidadRestanteRepuesto });
    }

    // Crea una nueva compra con el array completo de repuestos
    const nuevaCompra = new Compras({
      repuestos,
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
    for (const repuestoInfo of compra.repuestos) {
      const repuesto = await Repuesto.findById(repuestoInfo.repuesto);

      if (repuesto) {
        const cantidadRestanteRepuesto = repuesto.cantidad - repuestoInfo.cantidad_repuesto;

        await Repuesto.findByIdAndUpdate(repuestoInfo.repuesto, {
          cantidad: cantidadRestanteRepuesto,
        });
      }
    }

    // Actualizar el estado de la compra
    compra.anulado = true;
    await compra.save();

    res.json(compra);
  } catch (error) {
    return res.status(500).json({ message: "Error al anular la compra", error });
  }
};



export const deleteCompras = async (req, res) => {
  try {
    const deletedCompra = await Compras.findByIdAndDelete(req.params.id);
    if (!deletedCompra) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
