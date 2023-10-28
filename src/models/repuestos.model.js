 //Importa modulo para trabajar MongoDB en NodeJS
 import mongoose from "mongoose";

 //Estructurar los datos que representan a los clientes en la base de datos.
 const repuestosSchema = new mongoose.Schema({
     nombre_repuesto: {
         type: String, //Tipo String
         required: true, //Es requerido
         
     },
     cantidad: {
         type: Number, //Tipo String
         required: true, //Es requerido
         trim: true, // Limpiar espacios de los inputs
     },
     precio: {
         type: Number, //Tipo String
         required: true, //Es requerido
         trim: true
     },
 },{
     //Sirve para agregar automáticamente campos createdAt y updatedAt a los documentos, lo que permite realizar un seguimiento de cuándo se crearon y modificaron.
     timestamps: true
 })
 // Se puede poner un max lend, buscar en la documentacion
 export default mongoose.model("repuestos", repuestosSchema) 
 // Se va guardar en user 1 primer parametro el segundo es el establecimiento del schema tambien es el nombre de la coleccion y se crea automaticamente