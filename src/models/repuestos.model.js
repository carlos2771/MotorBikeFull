// Importa el módulo mongoose
import mongoose from "mongoose";

// Define el esquema para los repuestos
const repuestosSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    nombre_marca: { type: String },
    img: { type: String },
    amount: { type: Number},
    price: { type: Number, required: true },
    inCart: { type: Boolean, default: false },
    marca: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "marca",
        required: true,
    },
    estado: {
        type: String,
        required: true
    }
}, {
    // Agrega automáticamente campos createdAt y updatedAt a los documentos
    timestamps: true
});

// Define un hook antes de guardar el documento
repuestosSchema.pre('save', function (next) {
    // Verifica si el nombre existe y no está vacío
    if (this.name && this.name.length > 0) {
        // Convierte la primera letra del nombre a mayúscula
        this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
    }
    next(); // Continúa con la operación de guardado
});

// Exporta el modelo de repuestos
export default mongoose.model("repuestos", repuestosSchema);
