import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createCliente, deleteCliente, getClientes, getCliente, updateCliente } from "../controllers/clientes.controller.js";
import {validateSchema} from "../middlewares/validator.middleware.js"
import { clienteSchema } from "../schemas/clientes.schema.js";


// Crea una instancia de enrutador de Express
const router = Router()

// Configura rutas y controladores
router.get("/clientes", authRequired,  getClientes) 
router.get("/clientes/:id", authRequired,  getCliente) 
router.post("/clientes", authRequired,validateSchema(clienteSchema),  createCliente) 
router.put("/clientes/:id", authRequired,validateSchema(clienteSchema), updateCliente) 
router.delete("/clientes/:id", authRequired,  deleteCliente ) 

// Exporta el enrutador configurado
export default router