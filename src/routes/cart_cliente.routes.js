import { Router } from "express";
import {createCartCliente, getCartClien, getCartClient} from "../controllers/cart_cliente.controller.js"
const router = Router()

router.get("/cart-cliente", getCartClient)
router.get("/cart-cliente/:id", getCartClien)
router.post("/cart-cliente",createCartCliente)

export default router