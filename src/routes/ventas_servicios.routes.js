import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createVentas_Servicios, deleteVentas_Servicios, getVenta_Servicio, getVentas_Servicios, updateVentas_Servicios } from "../controllers/ventas_servicios.controller.js";
import { ventas_serviciosSchema} from "../schemas/ventas_servicios.schema.js";
import {validateSchema} from "../middlewares/validator.middleware.js"
const router = Router()

router.get("/ventas_servicios", authRequired, getVentas_Servicios)
router.get("/ventas_servicios/:id", authRequired,  getVenta_Servicio) 
router.post("/ventas_servicios", authRequired,validateSchema(ventas_serviciosSchema), createVentas_Servicios) 
router.put("/ventas_servicios/:id", authRequired,updateVentas_Servicios) 
router.delete("/ventas_servicios/:id", authRequired, deleteVentas_Servicios ) 

export default router