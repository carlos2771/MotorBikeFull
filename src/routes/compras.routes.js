import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createCompras, deleteCompras, getCompra, getCompras, updateCompras, } from "../controllers/compras.controller.js";
const router = Router()

router.get("/compras", authRequired, getCompras)
router.get("/compras/:id", authRequired, getCompra)
router.post("/compras", authRequired, createCompras)
router.put("/compras/:id", authRequired, updateCompras)
router.delete("/compras/:id", authRequired, deleteCompras)

export default router