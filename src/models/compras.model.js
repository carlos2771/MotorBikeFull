import mongoose from "mongoose";
const comprasSchema = new mongoose.Schema(
  {

    // ESTE ME PERMITE INRGRESAR VARIOS REPUESTOS A LA COMPRA
    repuestos: [
      {
        repuesto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "repuestos",
          required: true,
        },
        nombre_repuesto: { // Agregar campo para el nombre del repuesto
          type: String,
        },
        marca_repuesto: { // Agregar campo para el nombre del repuesto
          type: String,
        },
        cantidad_repuesto: {
          type: Number,
          required: true,
        },
        precio_unitario: {
          type: Number,
          required: true,
        },
        precio_total: {
          type: Number,
          required: true,
        },
      },
    ],
    // LA FECHA DE LA COMPRA
    fecha: {
      type: Date,
      default: Date.now,
    },
    // EL ESTADO 
    anulado: {
      type: Boolean,
      default: false,
    },
    proveedor: {
      type: String,
      required: true,
      trim: true
    },
    codigo: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("compras", comprasSchema);
