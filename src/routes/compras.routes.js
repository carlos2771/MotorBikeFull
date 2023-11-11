import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createCompra,  deleteCompras,  getCompras,  getCompra, updateCompras, } from "../controllers/compras.controller.js";
const router = Router()

router.get("/compras", authRequired,  getCompras) 
router.get("/compras/:id", authRequired, getCompra) 
router.post("/compras", authRequired, createCompra) 
router.put("/compras/:id", authRequired, updateCompras) 
router.delete("/compras/:id", authRequired, deleteCompras ) 

export default router