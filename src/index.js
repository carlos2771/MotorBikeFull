import app from "./app.js";
import { connectDB } from "./db.js"; // have keys for that exportation is without default
import { port } from "./config.js"

connectDB() // inicialice la conexion

app.listen(port)
console.log("server port", port);