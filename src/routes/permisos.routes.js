import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createPermiso, deletePermiso, getPermiso, getPermisos, updatePermiso } from "../controllers/permisos.controller.js";



// Crea una instancia de enrutador de Express
const router = Router()

// Configura rutas y controladores
router.get("/permisos", authRequired,  getPermisos) 
router.get("/permisos/:id", authRequired,  getPermiso) 
router.post("/permisos", authRequired,  createPermiso) 
router.put("/permisos/:id", authRequired, updatePermiso) 
router.delete("/permisos/:id", authRequired,  deletePermiso ) 

// Exporta el enrutador configurado
export default router