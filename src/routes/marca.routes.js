import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createMarca, deleteMarca, getMarca, getMarcas, updateMarca } from "../controllers/marcas.controller.js";
import {validateSchema} from "../middlewares/validator.middleware.js"
import { marcaSchema } from "../schemas/marcas.schema.js";

// Crea una instancia de enrutador de Express
const router = Router()

// Configura rutas y controladores
router.get("/marcas",authRequired, getMarcas)
router.get("/marcas/:id",authRequired, getMarca)  
router.post("/marcas", authRequired, validateSchema(marcaSchema), createMarca) 
router.delete("/marcas/:id", authRequired, deleteMarca) 
router.put("/marcas/:id", authRequired, updateMarca) 

// Exporta el enrutador configurado
export default router