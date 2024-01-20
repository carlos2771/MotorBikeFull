//Importa modulo para trabajar MongoDB en NodeJS
import mongoose from "mongoose";

//Estructurar los datos que representan a los clientes en la base de datos.
const repuestosSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    img: { type: String },
    amount: { type: Number, required: true },
    price: { type: Number, required: true },
    marca: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "marca",
        required: true,
    },
    estado: {
        type: String,
        required: true
    }
}, {
    //Sirve para agregar automáticamente campos createdAt y updatedAt a los documentos, lo que permite realizar un seguimiento de cuándo se crearon y modificaron.
    timestamps: true
})
// Se puede poner un max lend, buscar en la documentacion
export default mongoose.model("repuestos", repuestosSchema)
// Se va guardar en user 1 primer parametro el segundo es el establecimiento del schema tambien es el nombre de la coleccion y se crea automaticamente
