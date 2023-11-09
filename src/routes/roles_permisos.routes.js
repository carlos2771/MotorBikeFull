import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createRol_Permiso,  deleteRol_Permisos,  getRol_Permiso,  getRol_Permisos, updateRol_Permisos } from "../controllers/rol_permisos.controller.js";
const router = Router()

router.get("/roles_permisos", authRequired,  getRol_Permisos) 
router.get("/roles_permisos/:id", authRequired,  getRol_Permiso) 
router.post("/roles_permisos", authRequired,  createRol_Permiso) 
router.put("/roles_permisos/:id", authRequired,  updateRol_Permisos) 
router.delete("/roles_permisos/:id", authRequired,  deleteRol_Permisos ) 

export default router