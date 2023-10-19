import mongoose from "mongoose";

const marcaSchema = new mongoose.Schema({
    nombre_marca: {
        type: String,
        required: true,
        trim: true, // limpiar espacios de los inputs
    }
},{
    timestamps: true
})
// se puede poner un max lend, buscar en la documentacion
export default mongoose.model("clientes", clienteSchema) // se va guardar en user 1 primer parametro el segundo es 
//el establecimiento del schema tambien es el nombre de la coleccion y se crea automaticamente