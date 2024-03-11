import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createRol, deleteRol, getRol, getRoles, updateRol } from "../controllers/rols.controller.js";
import {validateSchema} from "../middlewares/validator.middleware.js"
// import { RolSchema } from "../schemas/marcas.schema.js";

// Crea una instancia de enrutador de Express
const router = Router()

// Configura rutas y controladores
router.get("/rol",authRequired, getRoles)
router.get("/rol/:id",authRequired, getRol)  
router.post("/rol", authRequired, createRol) 
router.delete("/rol/:id", authRequired, deleteRol) 
router.put("/rol/:id", authRequired, updateRol) 

// Exporta el enrutador configurado
export default router