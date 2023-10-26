import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createCliente, deleteCliente, getCliente, getClientes, updateCliente } from "../controllers/clientes.controller.js";



// Crea una instancia de enrutador de Express
const router = Router()

// Configura rutas y controladores
router.get("/clientes", authRequired,  getClientes) 
router.get("/clientes/:id", authRequired,  getCliente) 
router.post("/clientes", authRequired,  createCliente) 
router.put("/clientes/:id", authRequired, updateCliente) 
router.delete("/clientes/:id", authRequired,  deleteCliente ) 

// Exporta el enrutador configurado
export default router