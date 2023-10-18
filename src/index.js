import app from "./app.js";
import { connectDB } from "./db.js"; // have keys for that exportation is without default

connectDB() // inicialice la conexion

app.listen(3001)
console.log("server port", 3001);