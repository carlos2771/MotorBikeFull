import Cart from "../models/cart.js"
import CartCliente from "../models/cart_cliente.js"
import Cliente from "../models/cart_cliente.js"


export const getCartClient = async (req, res) => {
  try {
    const cart_cliente = await CartCliente.find().populate({ path: 'cliente', select: 'nombre_cliente' })
    if (!cart_cliente) {
      return res.status(404).json({ message: "Venta_servicios no encontrados" });
    }
    res.json(cart_cliente);
  } catch (error) {
    console.error("error", error)
  }
};


export const createCartCliente = async (req, res) => {
    try {
      const { cart, cliente: clienteId } = req.body;


      const nuevaCartCliente = new CartCliente({
        cliente: clienteId,
        cart
      });
  
  
      const cartClienteSave = await nuevaCartCliente.save();
      console.log(cartClienteSave);
  
      res.status(201).json({ message: 'Carritos de cliente creados correctamente' });
  
    } catch (error) {
      console.error('Error al crear la CartCliente', error);
      return res.status(500).json({ message: 'Error al crear la CartCliente', error: error.message });
    }
  };
  
export const getCartClien = async(req, res) =>{
  try {
    const cartClien = await CartCliente.findById(req.params.id)
    if (!cartClien) {
      return res.status(404).json({ message: "cartCliente not found" });
    }
    res.json(cartClien);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener cartCliente ", error });
  }
}