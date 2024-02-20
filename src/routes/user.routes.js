import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createUsuario, getUsuarios,  getUsuario,  updateUsuario, deleteUsuario} from "../controllers/user.controller.js";

const router = Router()

router.get("/usuarios",  getUsuarios) 
router.get("/usuarios/:id", authRequired,  getUsuario) 
router.post("/usuarios", authRequired,  createUsuario) 
router.put("/usuarios/:id", authRequired, updateUsuario) 
router.delete("/usuarios/:id", authRequired,  deleteUsuario)

export default router