import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createMecanico, deleteMecanico, getMecanico, getMecanicos, updateMecanico } from "../controllers/mecanicos.controller.js";

// Crea una instancia de enrutador de Express
const router = Router()

// Configura rutas y controladores
router.get("/mecanicos", authRequired,  getMecanicos) 
router.get("/mecanicos/:id", authRequired,  getMecanico) 
router.post("/mecanicos", authRequired,  createMecanico) 
router.put("/mecanicos/:id", authRequired, updateMecanico) 
router.delete("/mecanicos/:id", authRequired,  deleteMecanico ) 

// Exporta el enrutador configurado
export default router