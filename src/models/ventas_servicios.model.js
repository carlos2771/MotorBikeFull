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
  placa:{
    type: String,
  },
  estado: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ventas_serviciosSchema.pre('save', function (next) {
  // Ajusta la hora al huso horario de Colombia antes de guardar
  const offset = -5 * 60; // Ajuste en minutos para Colombia (UTC-5)
  const colombianTime = new Date(this.createdAt.getTime() + offset * 60 * 1000);
  this.createdAt = colombianTime;
  next();
});

export default mongoose.model("ventas_servicios", ventas_serviciosSchema);
