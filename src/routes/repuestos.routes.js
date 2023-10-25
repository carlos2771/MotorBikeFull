import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createRepuesto, deleteRepuesto, getRepuesto, updateRepuesto } from "../controllers/repuestos.controlles.js";
import {validateSchema} from "../middlewares/validator.middleware.js"

// Crea una instancia de enrutador de Express
const router = Router()

// Configura rutas y controladores
router.get("/repuestos", authRequired, getRepuesto) 
router.post("/repuestos", authRequired, createRepuesto) 
router.delete("/repuestos/:id", authRequired, deleteRepuesto) 
router.put("/repuestos/:id", authRequired, updateRepuesto) 

// Exporta el enrutador configurado
export default router