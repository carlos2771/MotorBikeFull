import mongoose from "mongoose";
// Conecta a la base de datos
const ventas_serviciosSchema = new mongoose.Schema({
  
     mecanico: {
        type: mongoose.Schema.Types.ObjectId, //para traer el _id
        ref: "mecanicos", 
        required: true
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId, //para traer el _id
        ref: "clientes", 
        required: true
    },
    precio_servicio:{
        type: Number,
        
    },
    descripcion:{
        type: String,
        
    },
    estado: {
        type: String,
        required: true
      }
    
},{
    timestamps: true
})


// se puede poner un max lend, buscar en la documentacion
export default mongoose.model("ventas_servicios", ventas_serviciosSchema) // se va guardar en user 1 primer parametro el segundo es 
//el establecimiento del schema tambien es el nombre de la coleccion y se crea automaticamente