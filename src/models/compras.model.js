import mongoose from "mongoose";

const comprasSchema = new mongoose.Schema(
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
        fecha: {
            type: Date,
            default: Date.now,
        },
        anulado: {
            type: Boolean, 
            default: false,
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

export default mongoose.model("compras", comprasSchema);
