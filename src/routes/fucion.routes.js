import { Router } from "express";
import { createServicio, deleteProduct, getTablaServicios, putProduct } from "../controllers/fucionTabla.controller.js";
const router = Router()



router.get("/tabla_servicio",   getTablaServicios) 

router.post("/tabla_servicio",   createServicio) 
router.put("/tabla_servicio/:tabla_serviciosId",   putProduct) 
router.delete("/tabla_servicio/:tabla_serviciosId",   deleteProduct ) 

export default router