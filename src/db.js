import mongoose from "mongoose";
import { dbConnect } from "./config.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(dbConnect); // al final se especifica la base de datos
        console.log("Conexión a la base de datos exitosa 👽");
    } catch (error) {
        console.error("Error de conexión a la base de datos:", error);
    }
};
