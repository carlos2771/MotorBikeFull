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
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    
  },{
    timestamps: true,
  }
  );

  comprasSchema.pre('save', function (next) {
    // Ajusta la hora al huso horario de Colombia antes de guardar
    const offset = -5 * 60; // Ajuste en minutos para Colombia (UTC-5)
    const colombianTime = new Date(this.createdAt.getTime() + offset * 60 * 1000);
    this.createdAt = colombianTime;
    next();
  });

export default mongoose.model("compras", comprasSchema);
