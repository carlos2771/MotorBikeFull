import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createMarca, deleteMarca, getMarcas, getMarca,updateMarca } from "../controllers/marcas.controller.js";
import {validateSchema} from "../middlewares/validator.middleware.js"
import { marcaSchema } from "../schemas/marcas.schema.js";

// Crea una instancia de enrutador de Express
const router = Router()

// Configura rutas y controladores
router.get("/marcas",authRequired, getMarcas) 
router.get("/marca/:id",authRequired, getMarca) 
router.post("/marca", authRequired, validateSchema(marcaSchema), createMarca) 
router.delete("/marca/:id", authRequired, deleteMarca) 
router.put("/marca/:id", authRequired, validateSchema(marcaSchema), updateMarca) 

// Exporta el enrutador configurado
export default router