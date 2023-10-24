import mongoose from "mongoose";

const permisoSchema = new mongoose.Schema({
    nombre_permiso: {
        type: String,
        required: true
    },
    estado:{
        type: String,
        required: true
    }
},{
    timestamps: true
})
// se puede poner un max lend, buscar en la documentacion
export default mongoose.model("permisos", permisoSchema) // se va guardar en user 1 primer parametro el segundo es 
//el establecimiento del schema tambien es el nombre de la coleccion y se crea automaticamente