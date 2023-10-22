import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createCliente, deleteCliente, getClientes, updateCliente } from "../controllers/clientes.controller.js";
import {validateSchema} from "../middlewares/validator.middleware.js"
import { clienteSchema } from "../schemas/clientes.schema.js";

const router = Router()

router.get("/clientes", authRequired, getClientes) 
router.post("/clientes", authRequired,validateSchema(clienteSchema), createCliente) 
router.delete("/clientes/:id", authRequired, deleteCliente ) 
router.put("/clientes/:id", authRequired,validateSchema(clienteSchema) ,updateCliente) 

export default router