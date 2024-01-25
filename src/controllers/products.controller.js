import Product from "../models/product.js"
import Cart from "../models/cart.js"
import multer from "multer";
import path from "path";
import Repuesto from "../models/repuestos.model.js";

export const addProductCart = async (req, res) => {
  const { name, img, price } = req.body;
  
  /* Nos fijamos si tenemos el producto */
  const estaEnProducts = await Repuesto.findOne({ name });
  // console.log(estaEnProducts, "para ver que retorna");

  /* Nos fijamos si el producto ya esta en el carrito */
  const estaEnElCarrito = await Cart.findOne({ name });

  /* Si no tenemos el producto */
  if (!estaEnProducts) {
    res.status(400).json({
      mensaje: "Este producto no se encuentra en nuestra base de datos",
    });

    /* Si nos envian algo y no esta en el carrito lo agregamos */
  } else if ( !estaEnElCarrito) {
    const newProductInCart = new Cart({ name, img, price, amount: 1 });

    /* Y actualizamos la prop inCart: true en nuestros productos */
    await Repuesto.findByIdAndUpdate(
      estaEnProducts?._id, // interrogacion para acceder a las propiedades de un objeto y para ver si es nulo o indefinido. retorna undefined
      { inCart: true, name, img, price },
      { new: true }
    )
      .then((product) => {
        newProductInCart.save();
        res.json({
          mensaje: `El producto fue agregado al carrito`,
          product,
        });
      })
      .catch((error) => console.error(error));

    /* Y si esta en el carrito avisamos */
  } else if (estaEnElCarrito) {
    res.status(400).json({
      mensaje: "El producto ya esta en el carrito",
    });
  }
};



export const deleteProduct = async (req, res) => {
    const { productId } = req.params;
  
    /* Buscamos el producto en el carrito */
    const productInCart = await Cart.findById(productId);
    
  
    /* Buscamos el producto en nuestra DB por el nombre del que esta en el carrito */
    const { name, img, price, _id } = await Repuesto.findOne({
      name: productInCart.name,
    });
    const dato = await Repuesto.findOne({
      name: productInCart.name,
    });
   
    dato.amount +=1
    await dato.save()
  
    /* Buscamos y eliminamos el producto con la id */
    await Cart.findByIdAndDelete(productId);
    
    await Repuesto.findByIdAndUpdate( // se actualiza para poder sacarlo de la base de datos ya que tiene un boolean 
      _id,
      { inCart: false, name, img, price },
      { new: true }
    )
      .then((product) => {
        res.json({
          mensaje: `El producto ${product.name} fue eliminado del carrito`,
        });
      })
      .catch((error) => res.json({ mensaje: "Hubo un error" }));
  };


  // 

  export const getProducts = async (req, res) => {
    // productos
    const products = await Repuesto.find();
  
    if (products) {
      res.json({ products });
    } else {
      res.json({ mensaje: "No hay productos" });
    }
  };
  

  // 

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
  
    /* Buscamos el producto en el carrito */
    const productBuscado = await Cart.findById(productId);
    
  
    /* Si no hay query 'add' o 'del' */
    if (!query) {
      res.status(404).json({ mensaje: "Debes enviar una query" });
  
      /* Si esta el producto en el carrito y quiero agregar */
    } else if (productBuscado && query === "add") {
      body.amount = body.amount + 1;
  
      await Cart.findByIdAndUpdate(productId, body, {
        new: true,
      }).then((product) => {
        res.json({
          mensaje: `El producto: ${product.name} fue actualizado`,
          product,
        });
      });
  
      /* Si esta el producto en el carrito y quiero sacar */
    } else if (productBuscado && query === "del") {
      body.amount = body.amount - 1;
  
      await Cart.findByIdAndUpdate(productId, body, {
        new: true,
      }).then((product) =>
        res.json({
          mensaje: `El producto: ${product.name} fue actualizado`,
          product,
        })
      );
    } else {
      res.status(400).json({ mensaje: "Ocurrio un error" });    
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
