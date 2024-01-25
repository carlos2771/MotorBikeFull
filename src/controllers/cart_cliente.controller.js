
import CartCliente from "../models/cart_cliente.js"
import Repuesto from "../models/repuestos.model.js"


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

      for(const cartData of cart){
        const respuestoEncontrado = await Repuesto.findOne({ name: cartData.name })
        if (!respuestoEncontrado) {
          return res.status(404).json({ message: ["Repuesto no encontrado"] });
        }

        const cantidadActualRepuesto = respuestoEncontrado.amount
        const cantidadVender = cartData.amount
        console.log("cantidad que se supone que se va vender",cartData.amount);
        console.log("cantidad existente",respuestoEncontrado.amount);

        if(cantidadActualRepuesto< cantidadVender){
          return res.status(400).json({ message: ["Cantidad insuficiente del repuesto"] });
        }
        const cantidadRestanteRepuesto = cantidadActualRepuesto - cantidadVender;
        await Repuesto.findOneAndUpdate({name: cartData.name}, { amount: cantidadRestanteRepuesto });
      }

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


export const updateCartClient = async (req, res) => {
  
    try {
      const cartCliente = await CartCliente.findById(req.params.id);
  
      if (!cartCliente) {
        return res.status(404).json({ message: "CartCliente no encontrado" });
      }
  
      // Llamar al método 'anular'
      await cartCliente.anular();
  
      res.json({ message: "CartCliente anulado correctamente" });
    } catch (error) {
      console.error("Error al anular CartCliente", error);
      return res.status(500).json({ message: "Error al anular CartCliente", error: error.message });
    }
};

