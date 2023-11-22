import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { CreateCompras, deleteCompras, getCompras, getCompra, updateCompras, }
from "../controllers/compras.controller.js";
const router = Router()

router.get("/compras", authRequired, getCompras)
router.get("/compras/:id", authRequired, getCompra)
router.post("/compras", authRequired, CreateCompras)
router.put("/compras/:id", authRequired, updateCompras)
router.delete("/compras/:id", authRequired, deleteCompras)

export default router