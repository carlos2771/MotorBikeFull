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
        required: true
    },
    resetToken: { 
        type: String 
    },
    resetTokenExpires: { 
        type: Date 
    } // Nueva propiedad para almacenar la fecha de expiración
},{
    timestamps: true
})
// se puede poner un max lend, buscar en la documentacion
export default mongoose.model("usuarios", userSchema) // se va guardar en user 1 primer parametro el segundo es 
//el establecimiento del schema tambien es el nombre de la coleccion y se crea automaticamente