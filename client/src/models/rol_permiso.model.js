import mongoose from "mongoose";

const rol_permisosSchema = new mongoose.Schema(
  {
    rol: {
      type: mongoose.Schema.Types.ObjectId, // para traer el _id
      ref: "roles",
      required: true,
    },
    permiso: {
      type: mongoose.Schema.Types.ObjectId, // para traer el _id
      ref: "permisos",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("rol_permisos", rol_permisosSchema);
