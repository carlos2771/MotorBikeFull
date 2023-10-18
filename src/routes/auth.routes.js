import { Router } from "express";
import { login, logout, profile, register, verifyToken } from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import {validateSchema} from "../middlewares/validator.middleware.js"
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";



const router = Router()

router.post("/register", validateSchema(registerSchema), register)  // se le pasa la funcion de validarSchema y se le asigna su respectivo parametro
router.post("/login", validateSchema(loginSchema), login) // lo mismo que arriba
router.post("/logout", logout)
router.get("/profile", authRequired, profile) // para las rutas protegidas, donde el usuario si este logueado
router.get("/verify", verifyToken)

export default router