import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createMecanico, deleteMecanico, getMecanico, updateMecanico } from "../controllers/mecanicos.controller.js";

const router = Router()

router.get("/mecanicos", authRequired, getMecanico) 
router.post("/mecanicos", authRequired, createMecanico) 
router.delete("/mecanicos/:id", authRequired, deleteMecanico) 
router.put("/mecanicos/:id", authRequired, updateMecanico) 

export default router