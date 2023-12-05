import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createRepuestos, deleteRepuesto, getRepuesto, getRepuestos, updateRepuestos } from "../controllers/repuestos.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js"

// Crea una instancia de enrutador de Express
const router = Router()

// Configura rutas y controladores
router.get("/repuestos", authRequired, getRepuestos)
router.get("/repuestos/:id", authRequired, getRepuesto)
router.post("/repuestos", authRequired, createRepuestos)
router.delete("/repuestos/:id", authRequired, deleteRepuesto)
router.put("/repuestos/:id", authRequired, updateRepuestos)

// Exporta el enrutador configurado
export default router