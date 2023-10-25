import mongoose from "mongoose";

const ventas_repuestosSchema = new mongoose.Schema({
  repuesto: {
    type: mongoose.Schema.Types.ObjectId, //para traer el _id
    ref: "repuestos",
    required: true,
  },
  cantidad_repuesto: {
    type: Number,
    required: true,
  },
  precio_unitario: {
    type: Number,
    require: true,
  },
  precio_total: {
    type: Number,
    require: true,
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId, //para traer el _id
    ref: "clientes",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});
export default mongoose.model("ventas_repuestos", ventas_repuestosSchema)
