import express from "express"
import morgan from "morgan"
import authRoutes from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import taskRoutes from "./routes/tasks.routes.js"
import clientesRoutes from "./routes/clientes.routes.js"
import cors  from 'cors'

const app = express()


// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     res.header("Access-Control-Allow-Credentials", true);
//     next();
//   });
app.use(cors({
    origin:'http://127.0.0.1:5173', // Reemplaza esto con la URL de tu aplicación React
    credentials: true,
}
))
app.use(morgan("dev"))
app.use(express.json()) // para que me lea las solicitudes y los req.body en formato json
app.use(cookieParser())
app.use("/api",authRoutes)
app.use("/api", taskRoutes)
app.use("/api", clientesRoutes)

export default app;