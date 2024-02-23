import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true // limpiar espacios de los inputs
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    resetToken: { 
        type: String 
    },
    resetTokenExpires: { 
        type: Date 
    }, // Nueva propiedad para almacenar la fecha de expiración
    code: { 
        type: String 
    },
    rol: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rols', // Referencia al modelo de roles
        default: '65d64929fbf584c5da075538' // Establecer el valor por defecto aquí
    },
    estado:{
        type: String,
    }


},{
    timestamps: true
})
// se puede poner un max lend, buscar en la documentacion
export default mongoose.model("usuarios", userSchema) // se va guardar en user 1 primer parametro el segundo es 
//el establecimiento del schema tambien es el nombre de la coleccion y se crea automaticamente