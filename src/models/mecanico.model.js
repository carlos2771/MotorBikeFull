//Importa modulo para trabajar MongoDB en NodeJS
import mongoose from "mongoose";

//Estructurar los datos que representan a los mecanicos en la base de datos.
const mecanicoSchema = new mongoose.Schema({
    nombre_mecanico: {
        type: String, //Tipo String
        required: true, //Es requerido
        trim: true // limpiar espacios de los inputs
    },
    cedula_mecanico: {
        type: String, //Tipo String
        required: true,//Es requerido
        trim: true, // limpiar espacios de los inputs
        unique: true //Unico
    },
    telefono_mecanico: {
        type: String,  //Tipo String
        required: true //Es requerido
    },
    direccion_mecanico:{
        type: String,  //Tipo String
        required: true, //Es requerido
        
    },
},{
    //Sirve para agregar automáticamente campos createdAt y updatedAt a los documentos, lo que permite realizar un seguimiento de cuándo se crearon y modificaron.
    timestamps: true 
    
})
// se puede poner un max lend, buscar en la documentacion
export default mongoose.model("mecanico", mecanicoSchema) // se va guardar en user 1 primer parametro el segundo es el establecimiento del schema tambien es el nombre de la coleccion y se crea automaticamente