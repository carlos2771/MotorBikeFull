import mongoose from "mongoose";

const ventas_serviciosSchema = new mongoose.Schema({
  mecanico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "mecanicos",
    required: true,
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "clientes",
    required: true,
  },
  precio_servicio: {
    type: Number,
  },
  descripcion: {
    type: String,
  },
  estado: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date, // Asegúrate de que el tipo sea Date
    default: Date.now, // Valor predeterminado para la fecha de creación
  },
});

export default mongoose.model("ventas_servicios", ventas_serviciosSchema);
