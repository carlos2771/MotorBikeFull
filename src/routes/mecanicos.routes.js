import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
<<<<<<< HEAD
import { createMecanico, deleteMecanico, getMecanicos, getMecanico, updateMecanico } from "../controllers/mecanicos.controller.js";
=======
import { getMecanicos, createMecanico, deleteMecanico, getMecanico, updateMecanico } from "../controllers/mecanicos.controller.js";
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
import {validateSchema} from "../middlewares/validator.middleware.js"
import { mecanicoSchema } from "../schemas/mecanicos.schema.js";

// Crea una instancia de enrutador de Express
const router = Router()

// Configura rutas y controladores
router.get("/mecanicos", authRequired, getMecanicos) 
<<<<<<< HEAD
router.get("/mecanico/:id", authRequired, getMecanico) 
router.post("/mecanicos", authRequired, validateSchema(mecanicoSchema) ,createMecanico) 
router.delete("/mecanico/:id", authRequired, deleteMecanico) 
router.put("/mecanico/:id", authRequired, validateSchema(mecanicoSchema), updateMecanico) 
=======
router.get("/mecanicos/:id", authRequired, getMecanico) 
router.post("/mecanicos", authRequired,createMecanico) 
router.delete("/mecanicos/:id", authRequired, deleteMecanico) 
router.put("/mecanicos/:id", authRequired, updateMecanico) 
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091

// Exporta el enrutador configurado
export default router