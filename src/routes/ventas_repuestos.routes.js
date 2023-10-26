import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createVentas_Repuestos,  deleteVentas_Repuestos,  getVenta_Repuesto,  getVentas_Repuestos, updateVentas_Repuestos, } from "../controllers/ventas_repuestos.controller.js";
const router = Router()

router.get("/ventas_repuestos", authRequired,  getVentas_Repuestos) 
router.get("/ventas_repuestos/:id", authRequired,  getVenta_Repuesto) 
router.post("/ventas_repuestos", authRequired,  createVentas_Repuestos) 
router.put("/ventas_repuestos/:id", authRequired,  updateVentas_Repuestos) 
router.delete("/ventas_repuestos/:id", authRequired,  deleteVentas_Repuestos ) 

export default router