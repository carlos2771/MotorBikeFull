import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createMecanico, deleteMecanico, getMecanico, updateMecanico } from "../controllers/mecanicos.controller.js";
import {validateSchema} from "../middlewares/validator.middleware.js"
import { mecanicoSchema } from "../schemas/mecanicos.schema.js";


const router = Router()

router.get("/mecanicos", authRequired, getMecanico) 
router.post("/mecanicos", authRequired, validateSchema(mecanicoSchema) ,createMecanico) 
router.delete("/mecanicos/:id", authRequired, deleteMecanico) 
router.put("/mecanicos/:id", authRequired, validateSchema(mecanicoSchema), updateMecanico) 

export default router