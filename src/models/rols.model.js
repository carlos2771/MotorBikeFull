import mongoose from "mongoose";

const rolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  permissions: [{
    type: String,
    required: true
  }],
  status: {
    type: String,
    enum: ['Activo', 'Inactivo'],
    default: 'Activo'
  }
}, {
    //Sirve para agregar automáticamente campos createdAt y updatedAt a los documentos, lo que permite realizar un seguimiento de cuándo se crearon y modificaron.
    timestamps: true
});

export default mongoose.model("rols", rolSchema)
