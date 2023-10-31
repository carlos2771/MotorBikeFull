//Importa modulo para trabajar MongoDB en NodeJS
import mongoose from "mongoose";

// Estructurar los datos que representan a los roles en la base de datos.
const rolSchema = new mongoose.Schema({
    nombre_rol: {
        type: String, //Tipo de dato
        required: true // Es requerido
    },
    estado:{
        type: String, // Tipo de dato
        required: true // Es requerido
    }
},{
    //Sirve para agregar automáticamente campos createdAt y updatedAt a los documentos, lo que permite realizar un seguimiento de cuándo se crearon y modificaron.
    timestamps: true
})
// se puede poner un max lend, buscar en la documentacion
export default mongoose.model("roles", rolSchema) // se va guardar en user 1 primer parametro el segundo es 
//el establecimiento del schema tambien es el nombre de la coleccion y se crea automaticamente