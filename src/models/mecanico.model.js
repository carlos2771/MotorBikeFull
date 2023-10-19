import mongoose from "mongoose";

const mecanicoSchema = new mongoose.Schema({
    nombre_mecanico: {
        type: String,
        required: true,
        trim: true // limpiar espacios de los inputs
    },
    cedula_mecanico: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    telefono_mecanico: {
        type: String,
        required: true
    },
    direccion_mecanico:{
        type: String,
        required: true,
        
    },
},{
    timestamps: true //sirve para agregar automáticamente campos createdAt y updatedAt a los documentos, lo que permite realizar un seguimiento de cuándo se crearon y modificaron.
})
// se puede poner un max lend, buscar en la documentacion
export default mongoose.model("mecanico", mecanicoSchema) // se va guardar en user 1 primer parametro el segundo es el establecimiento del schema tambien es el nombre de la coleccion y se crea automaticamente