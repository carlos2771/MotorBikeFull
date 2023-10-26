import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createMecanico, deleteMecanico, getMecanicos, getMecanico, updateMecanico } from "../controllers/mecanicos.controller.js";
import {validateSchema} from "../middlewares/validator.middleware.js"
import { mecanicoSchema } from "../schemas/mecanicos.schema.js";

// Crea una instancia de enrutador de Express
const router = Router()

// Configura rutas y controladores
router.get("/mecanicos", authRequired, getMecanicos) 
router.get("/mecanicos/:id", authRequired, getMecanico) 
router.post("/mecanicos", authRequired, validateSchema(mecanicoSchema) ,createMecanico) 
router.delete("/mecanicos/:id", authRequired, deleteMecanico) 
router.put("/mecanicos/:id", authRequired, validateSchema(mecanicoSchema), updateMecanico) 

// Exporta el enrutador configurado
export default router