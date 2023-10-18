import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://admin:admin@cluster0.49jaesh.mongodb.net/motorBike"); // al final se especifica la base de datos
        console.log("Conexión a la base de datos exitosa 👽");
    } catch (error) {
        console.error("Error de conexión a la base de datos:", error);
    }
};
