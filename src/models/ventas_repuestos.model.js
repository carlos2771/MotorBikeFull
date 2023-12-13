import mongoose from "mongoose";

const ventas_repuestosSchema = new mongoose.Schema(
  {
    repuestos: [
      {
        repuesto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "repuestos",
          required: true,
        },
        // cantidad_repuesto: {
        //   type: Number,
        //   required: true,
        // },
        // precio_unitario: {
        //   type: Number,
          
        // },
        // precio_total: {
        //   type: Number,
        // },
        cantidad_vender: {
          type: Number,
          default:0
        },
      },
    ],
    precio_total: {
      type: Number,
      
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId, // para traer el _id
      ref: "clientes",
      required: true,
    },
    // estado: {
    //   type: Boolean,
    //   required: true
    // },
    anulado: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ventas_repuestos", ventas_repuestosSchema);
