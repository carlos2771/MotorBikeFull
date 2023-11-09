import mongoose from "mongoose";

const rol_permisosSchema = new mongoose.Schema(
  {
    id_rol: {
      type: mongoose.Schema.Types.ObjectId, // para traer el _id
      ref: "roles",
      required: true,
    },
    id_permiso: {
      type: mongoose.Schema.Types.ObjectId, // para traer el _id
      ref: "permisos",
      required: true,
    },
    // date: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("rol_permisos", rol_permisosSchema);
