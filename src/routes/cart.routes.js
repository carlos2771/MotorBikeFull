import { Router } from "express";
import uploadMiddleware, { addProductCart, cleartCart, createProduct, deleteProduct, getProducts, getProductsCart, putProduct } from "../controllers/products.controller.js";

const router = Router()

router.get("/products" ,getProducts)
router.post("/products-add",uploadMiddleware(), createProduct)
router.get("/products-cart", getProductsCart)
router.post("/products-cart", addProductCart)
router.put("/products-cart/:productId", putProduct)
router.delete("/products-cart/:productId", deleteProduct)
router.post("/products-cart/delete", cleartCart)

export default router