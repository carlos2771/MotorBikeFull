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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("compras", comprasSchema);
