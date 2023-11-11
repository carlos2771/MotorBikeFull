import express from "express"
import morgan from "morgan"
import authRoutes from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import taskRoutes from "./routes/tasks.routes.js"
import clientesRoutes from "./routes/clientes.routes.js"
import mecanicosRoutes from "./routes/mecanicos.routes.js"
import ventas_serviciosRoutes from "./routes/ventas_servicios.routes.js"
import marcaRoutes from "./routes/marca.routes.js"
import repuestosRoutes from "./routes/repuestos.routes.js"
// import permisosRoutes from "./routes/permisos.routes.js"
import rolesRoutes from "./routes/roles.routes.js"
import roles_permisosRoutes from "./routes/roles_permisos.routes.js"
import ventas_repuestosRoutes from "./routes/ventas_repuestos.routes.js"
import comprasRoutes from "./routes/compras.routes.js"
import cors  from 'cors'

const app = express()


// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     res.header("Access-Control-Allow-Credentials", true);
//     next();
//   });
app.use(cors({
    origin:'http://localhost:5173', // Reemplaza esto con la URL de tu aplicación React
    credentials: true,
}
))
app.use(morgan("dev"))
app.use(express.json()) // para que me lea las solicitudes y los req.body en formato json
app.use(cookieParser())
app.use("/api",authRoutes)
app.use("/api", taskRoutes)
app.use("/api", clientesRoutes)
app.use("/api", mecanicosRoutes )
app.use("/api", marcaRoutes )
app.use("/api", ventas_serviciosRoutes)
app.use("/api", repuestosRoutes)
// app.use("/api", permisosRoutes) // Eliminar permisos - van quemados
app.use("/api", rolesRoutes)
app.use("/api", roles_permisosRoutes)
app.use("/api", ventas_repuestosRoutes)
app.use("/api", comprasRoutes)


export default app;