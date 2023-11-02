import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createRol, deleteRol, getRol, getRoles, updateRol } from "../controllers/roles.controller.js";



// Crea una instancia de enrutador de Express
const router = Router()

// Configura rutas y controladores
router.get("/roles", authRequired,  getRoles) 
router.get("/roles/:id", authRequired,  getRol) 
router.post("/roles", authRequired,  createRol) 
router.put("/roles/:id", authRequired, updateRol) 
router.delete("/roles/:id", authRequired,  deleteRol ) 

// Exporta el enrutador configurado
export default router