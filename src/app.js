import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import taskRoutes from "./routes/tasks.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import mecanicosRoutes from "./routes/mecanicos.routes.js";
import ventas_serviciosRoutes from "./routes/ventas_servicios.routes.js";
import marcaRoutes from "./routes/marca.routes.js";
import repuestosRoutes from "./routes/repuestos.routes.js";
import rolesRoutes from "./routes/roles.routes.js";
import roles_permisosRoutes from "./routes/roles_permisos.routes.js";
import ventas_repuestosRoutes from "./routes/ventas_repuestos.routes.js";
import comprasRoutes from "./routes/compras.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import cartClienteRoutes from "./routes/cart_cliente.routes.js";
import cors from 'cors';

const app = express();

app.use(cors({
    origin: "http://localhost:5173", // Reemplaza esto con la URL de tu aplicación React
    credentials: true,
}));

app.use(morgan("dev"));
app.use(express.json({ limit: '10mb' })); // Ajusta el límite según tus necesidades
app.use(cookieParser());
app.use("/api", authRoutes);
app.use("/api", taskRoutes);
app.use("/api", clientesRoutes);
app.use("/api", mecanicosRoutes);
app.use("/api", marcaRoutes);
app.use("/api", ventas_serviciosRoutes);
app.use("/api", repuestosRoutes);
app.use("/api", rolesRoutes);
app.use("/api", roles_permisosRoutes);
app.use("/api", ventas_repuestosRoutes);
app.use("/api", comprasRoutes);
app.use("/api", cartClienteRoutes);
app.use("/api", cartRoutes);

export default app;
