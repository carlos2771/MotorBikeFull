import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
    nombre_cliente: {
        type: String,
        required: true,
        trim: true // limpiar espacios de los inputs
    },
    email_cliente: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    telefono_cliente: {
        type: String,
        required: true
    },
    cedula:{
        type: String,
        required: true,
        unique: true
    },
},{
    timestamps: true
})
// se puede poner un max lend, buscar en la documentacion
export default mongoose.model("clientes", clienteSchema) // se va guardar en user 1 primer parametro el segundo es 
//el establecimiento del schema tambien es el nombre de la coleccion y se crea automaticamente