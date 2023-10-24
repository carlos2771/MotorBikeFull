import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createVentas_Servicios, deleteVentas_Servicios, getVentas_Servicios, updateVentas_Servicios } from "../controllers/ventas_servicios.controller.js";

const router = Router()

router.get("/ventas_servicios", authRequired, getVentas_Servicios) 
router.post("/ventas_servicios",  createVentas_Servicios) 
router.delete("/ventas_servicios/:id", authRequired, deleteVentas_Servicios ) 
router.put("/ventas_servicios/:id", authRequired, updateVentas_Servicios) 

export default router