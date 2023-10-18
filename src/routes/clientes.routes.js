import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createCliente, deleteCliente, getClientes, updateCliente } from "../controllers/clientes.controller.js";

const router = Router()

router.get("/clientes", authRequired, getClientes) 
router.post("/clientes", authRequired, createCliente) 
router.delete("/clientes/:id", authRequired, deleteCliente ) 
router.put("/clientes/:id", authRequired, updateCliente) 

export default router