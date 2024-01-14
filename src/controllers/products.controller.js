import Product from "../models/product.js"
import Cart from "../models/cart.js"
// import  Cliente from "../models/cliente.model.js"

export const addProductCart = async (req, res) => {
  const { name, img, price,  } = req.body;

  // const clienteEncontrado = await Cliente.findById(clienteId);
  // if (!clienteEncontrado) {
  //   return res.status(404).json({ message: "Cliente no encontrado" });
  // }

  /* Nos fijamos si tenemos el producto */
  const estaEnProducts = await Product.findOne({ name });
  console.log(estaEnProducts, "para ver que retorna");

  /* Nos fijamos si todos los campos vienen con info */
  const noEstaVacio = name !== "" && img !== "" && price !== "";

  /* Nos fijamos si el producto ya esta en el carrito */
  const estaEnElCarrito = await Cart.findOne({ name });

  /* Si no tenemos el producto */
  if (!estaEnProducts) {
    res.status(400).json({
      mensaje: "Este producto no se encuentra en nuestra base de datos",
    });

    /* Si nos envian algo y no esta en el carrito lo agregamos */
  } else if (noEstaVacio && !estaEnElCarrito) {
    const newProductInCart = new Cart({ name, img, price, amount: 1 });

    /* Y actualizamos la prop inCart: true en nuestros productos */
    await Product.findByIdAndUpdate(
      estaEnProducts?._id, // interrogacion para acceder a las propiedades de un objeto y para ver si es nulo o indefinido. retorna undefined
      { inCart: true, name, img, price },
      { new: true }
    )
      .then((product) => {
        newProductInCart.save();
        console.log("el nuevo", product);
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
    const { name, img, price, _id } = await Product.findOne({
      name: productInCart.name,
    });
  
    /* Buscamos y eliminamos el producto con la id */
    await Cart.findByIdAndDelete(productId);
    
    /* Buscamos y editamos la prop inCart: false */
    /* Le pasamos la id del producto en la DB */
    /* La prop a cambiar y las demas */
    /* Y el new para devolver el producto editado */
    await Product.findByIdAndUpdate( // se actualiza para poder sacarlo de la base de datos ya que tiene un boolean 
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
    const products = await Product.find();
  
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