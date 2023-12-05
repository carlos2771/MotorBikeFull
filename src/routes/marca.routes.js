import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
<<<<<<< HEAD
import { createMarca, deleteMarca, getMarcas, getMarca,updateMarca } from "../controllers/marcas.controller.js";
=======
import { createMarca, deleteMarca, getMarca, getMarcas, updateMarca } from "../controllers/marcas.controller.js";
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
import {validateSchema} from "../middlewares/validator.middleware.js"
import { marcaSchema } from "../schemas/marcas.schema.js";

// Crea una instancia de enrutador de Express
const router = Router()

// Configura rutas y controladores
<<<<<<< HEAD
router.get("/marcas",authRequired, getMarcas) 
router.get("/marca/:id",authRequired, getMarca) 
router.post("/marca", authRequired, validateSchema(marcaSchema), createMarca) 
router.delete("/marca/:id", authRequired, deleteMarca) 
router.put("/marca/:id", authRequired, validateSchema(marcaSchema), updateMarca) 
=======
router.get("/marcas",authRequired, getMarcas)
router.get("/marcas/:id",authRequired, getMarca)  
router.post("/marcas", authRequired, validateSchema(marcaSchema), createMarca) 
router.delete("/marcas/:id", authRequired, deleteMarca) 
router.put("/marcas/:id", authRequired, updateMarca) 
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091

// Exporta el enrutador configurado
export default router