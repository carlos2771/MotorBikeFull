import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createCompra, deleteCompra, getCompras, getCompra, updateCompra, } from "../controllers/compras.controller.js";
const router = Router()

router.get("/compras", authRequired, getCompras)
router.get("/compras/:id", authRequired, getCompra)
router.post("/compras", authRequired, createCompra)
router.put("/compras/:id", authRequired, updateCompra)
router.delete("/compras/:id", authRequired, deleteCompra)

export default router