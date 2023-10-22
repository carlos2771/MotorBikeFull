 //Importa modulo para trabajar MongoDB en NodeJS
import mongoose from "mongoose";

//Estructurar los datos que representan a las marcas en la base de datos.
const marcaSchema = new mongoose.Schema({
    nombre_marca: {
        type: String, // Tipo String
        required: true, //Es requerido
        trim: true, // limpiar espacios de los inputs
    }
},{
    //Sirve para agregar automáticamente campos createdAt y updatedAt a los documentos, lo que permite realizar un seguimiento de cuándo se crearon y modificaron.
    timestamps: true
})
// Se puede poner un max lend, buscar en la documentacion
export default mongoose.model("marca", marcaSchema) 
// Se va guardar en user 1 primer parametro el segundo es el establecimiento del schema tambien es el nombre de la coleccion y se crea automaticamente