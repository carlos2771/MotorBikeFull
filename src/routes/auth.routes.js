import { Router } from "express";
import { login, logout, profile, register, verifyToken, enviarToken, validarToken, actualizarPassword, createUsuario, getUsuarios,  getUsuario,  updateUsuario, deleteUsuario} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import {validateSchema} from "../middlewares/validator.middleware.js"
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";



const router = Router()

router.post("/register", validateSchema(registerSchema), register)  // se le pasa la funcion de validarSchema y se le asigna su respectivo parametro
router.post("/login", validateSchema(loginSchema), login) // lo mismo que arriba
router.post("/logout", logout)
router.get("/profile", authRequired, profile) // para las rutas protegidas, donde el usuario si este logueado
router.get("/verify", verifyToken)
//Recuperar password
router.post("/reestablecer", enviarToken)
router.post("/restablecer-password/:code", validarToken)
router.post("/reestablecer-password/:code", actualizarPassword)

router.get("/usuarios",  getUsuarios) 
router.get("/usuarios/:id", authRequired,  getUsuario) 
router.post("/usuarios", authRequired,  createUsuario) 
router.put("/usuarios/:id", authRequired, updateUsuario) 
router.delete("/usuarios/:id", authRequired,  deleteUsuario)

export default router