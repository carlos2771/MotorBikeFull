import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createMarca, deleteMarca, getMarca, updateMarca } from "../controllers/marcas.controller.js";

const router = Router()

router.get("/marcas",authRequired, getMarca) 
router.post("/marcas", authRequired, createMarca) 
router.delete("/marcas/:id", authRequired, deleteMarca) 
router.put("/marcas/:id", authRequired, updateMarca) 

export default router