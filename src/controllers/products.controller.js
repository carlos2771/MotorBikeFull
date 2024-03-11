import Product from "../models/product.js"
import Cart from "../models/cart.js"
import multer from "multer";
import path from "path";
import Repuesto from "../models/repuestos.model.js";
import CartCliente from "../models/cart_cliente.js"
export const addProductCart = async (req, res) => {
  const { name, img, price } = req.body;
  
  try {
    // Verificar si el producto está en la base de datos
    const estaEnProducts = await Repuesto.findOne({ name });

    if (!estaEnProducts) {
      return res.status(400).json({ mensaje: "Este producto no se encuentra en nuestra base de datos" });
    }

    // Verificar si el producto ya está en el carrito
    const estaEnElCarrito = await Cart.findOne({ name });

    // Si el producto no está en el carrito, lo agregamos
    if (!estaEnElCarrito) {
      const newProductInCart = new Cart({ name, img, price, amount: 1 });

      // Actualizamos la propiedad inCart en el producto
      await Repuesto.findByIdAndUpdate(estaEnProducts._id, { inCart: true });

      // Guardamos el nuevo producto en el carrito
      await newProductInCart.save();

      return res.json({
        mensaje: `El producto fue agregado al carrito`,
        product: newProductInCart,
      });
    } else {
      return res.status(400).json({ mensaje: "El producto ya está en el carrito" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};



export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Buscamos el producto en el carrito
    const productInCart = await Cart.findById(productId);
    
    if (!productInCart) {
      return res.status(404).json({ mensaje: "Producto no encontrado en el carrito" });
    }
    
    // Buscamos el producto en nuestra DB por el nombre del que está en el carrito
    const { name, img, price, _id } = await Repuesto.findOne({ name: productInCart.name });
    
    if (!_id) {
      return res.status(404).json({ mensaje: "Producto no encontrado en la base de datos" });
    }

    // Buscamos y eliminamos el producto con la ID
    await Cart.findByIdAndDelete(productId);
    
    // Actualizamos el producto en la base de datos
    await Repuesto.findByIdAndUpdate(_id, { inCart: false });

    return res.json({
      mensaje: `El producto ${name} fue eliminado del carrito`,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ mensaje: "Hubo un error en el servidor" });
  }
};


 
  export const getProducts = async (req, res) => {
    try {
      // Obtener productos con amount mayor a cero y estado 'activo'
      const products = await Repuesto.find({ estado: "Activo", amount: { $gt: 0 } });
  
      if (products) {
        res.json({ products });
      } else {
        res.json({ mensaje: "No hay productos activos con stock disponible" });
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  };


  export const getProductsCart = async (req, res) => {
    const productsCart = await Cart.find();
  
    if (productsCart) {
      res.json({ productsCart });
    } else {
      res.json({ mensaje: "No hay productos en el carrito" });
    }
  };
  
  export const putProduct = async (req, res) => {
    const { productId } = req.params;
    const { query } = req.query;
    const body = req.body;
  
    try {
      let product;
  
      // Verificar si el producto está en el carrito
      const productBuscado = await Cart.findById(productId);
  
      if (!productBuscado) {
        return res.status(404).json({ mensaje: "Producto no encontrado en el carrito" });
      }
  
      // Realizar las acciones según la query
      if (query === "add") {
        body.amount = (productBuscado.amount || 0) + 1;
      } else if (query === "del") {
        if (productBuscado.amount <= 1) {
          return res.status(400).json({ mensaje: "La cantidad mínima alcanzada" });
        }
        body.amount = (productBuscado.amount || 0) - 1;
      } else {
        return res.status(400).json({ mensaje: "Query inválida" });
      }
  
      // Actualizar el producto en el carrito
      product = await Cart.findByIdAndUpdate(productId, body, { new: true });
  
      if (!product) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
      }
  
      return res.json({
        mensaje: `El producto: ${product.name} fue actualizado`,
        product,
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  };
  export const putAmount = async (req, res) => {
    try {
      const { itemId, newAmount } = req.body;
  
      // Verificar si el nuevo monto es un número válido
      if (!isNaN(newAmount)) {
        console.log("cantidad debe ser un numero valido");
        return res.status(400).json({ message: "La cantidad debe ser un número válido" });
      }
  
      // Encontrar el carrito del cliente por su ID
      const cartCliente = await CartCliente.findById(req.params.id);
  
      if (!cartCliente) {
        return res.status(404).json({ message: "CartCliente no encontrado" });
      }
  
      // Encontrar el ítem en el carrito del cliente por su ID
      const cartItem = cartCliente.cart.find(item => item._id === itemId);
  
      if (!cartItem) {
        return res.status(404).json({ message: "El ítem no se encontró en el carrito del cliente" });
      }
  
      // Actualizar la cantidad del ítem en el carrito del cliente
      cartItem.amount = newAmount;
  
      // Guardar el carrito del cliente actualizado
      await cartCliente.save();
  
      // Actualizar el total del carrito del cliente (opcional, dependiendo de tus necesidades)
  
      res.json({ message: "Cantidad actualizada exitosamente" });
    } catch (error) {
      console.error("Error al actualizar la cantidad del ítem en el carrito del cliente", error);
      return res.status(500).json({ message: "Error al actualizar la cantidad del ítem en el carrito del cliente", error: error.message });
    }
  };


import fs from "fs"
// import base64 from 'base64-js';

import sharp from 'sharp'; // Importa el módulo sharp

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads';
    // Crea el directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

const uploadMiddleware = () => upload.single("img");

export default uploadMiddleware;

export const createProduct = async (req, res) => {
  try {
    const { name, inCart, price, cantidad } = req.body;
    const imgPath = req.file.path;

    // Redimensiona la imagen a un tamaño específico (por ejemplo, 300x300)
    const resizedImageBuffer = await sharp(imgPath)
      .resize({ width: 300, height: 300 })
      .toBuffer();

    // Convierte la imagen redimensionada a base64
    const base64Image = resizedImageBuffer.toString('base64');

    const product = new Product({
      name,
      img: base64Image,
      inCart,
      price,
      cantidad,
    });

    const productStored = await product.save();
    res.status(201).send({ productStored });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};


export const cleartCart = async (req, res) => {
  try {
    // Elimina todos los documentos en la colección 'Cart'
    const deleteCart = await Cart.deleteMany({});
    
    // Actualiza el estado 'inCart' a false en todos los productos
    const updateProducts = await Repuesto.updateMany({}, { inCart: false });

    // Verifica si se eliminaron carritos y se actualizaron productos
    if (deleteCart.deletedCount === 0 && updateProducts.nModified === 0) {
      return res.status(404).json({ message: "No carts or products found" });
    }

    return res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
