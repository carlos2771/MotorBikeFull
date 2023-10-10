import express from "express"
import morgan from "morgan"

import authRoutes from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import taskRoutes from "./routes/tasks.routes.js"
import clientesRoutes from "./routes/clientes.routes.js"
const app = express()


app.use(morgan("dev"))
app.use(express.json()) // para que me lea las solicitudes y los req.body en formato json
app.use(cookieParser())
app.use("/api",authRoutes)
app.use("/api", taskRoutes)
app.use("/api", clientesRoutes)

export default app;