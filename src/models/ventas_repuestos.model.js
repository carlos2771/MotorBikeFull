import mongoose from "mongoose";

const ventas_repuestosSchema = new mongoose.Schema(
  {
    repuesto: {
      type: mongoose.Schema.Types.ObjectId, // para traer el _id
      ref: "repuestos",
      required: true,
    },
    cantidad_repuesto: {
      type: Number,
      required: true,
    },
    precio_unitario: {
      type: Number,
      required: true, // Corregido de "require" a "required"
    },
    precio_total: {
      type: Number,
      required: true, // Corregido de "require" a "required"
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId, // para traer el _id
      ref: "clientes",
      required: true,
    },
    estado: {
      type: String,
      required: true
    }
    // date: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ventas_repuestos", ventas_repuestosSchema);
