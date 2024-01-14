import { Router } from "express";
import { addProductCart, deleteProduct, getProducts, getProductsCart, putProduct } from "../controllers/products.controller.js";

const router = Router()

router.get("/products", getProducts)
router.get("/products-cart", getProductsCart)
router.post("/products-cart", addProductCart)
router.put("/products-cart/:productId", putProduct)
router.delete("/products-cart/:productId", deleteProduct)

export default router