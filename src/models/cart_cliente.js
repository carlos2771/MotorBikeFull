import mongoose from "mongoose";
import Repuesto from "../models/repuestos.model.js";
const generateRandomCode = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }; 
const CartClienteSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: "clientes" },
  cart: [
    {
      cartItem: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
      name: { type: String },
    //   img: { type: String },voy a eliminar imagen para no sobre cargar la solicitud
      amount: { type: Number },
      price: { type: Number },
    }, 
  ],
  total: { type: Number }, // Nuevo campo para almacenar el total
  codigo: {type: String},
  anulado: {
    type: Boolean,
    default: false,
  },
});
// voy a eliminar imagen para no sobre cargar la solicitud
// para calcular el total antes de guardar
CartClienteSchema.pre("save", function (next) {
   const cartTotal = this.cart.reduce( //Sumar los valores de amount y price para cada elemento en la subcolección cart
    (acc, cartItem) => acc + cartItem.amount * cartItem.price,
    0
  );
  this.total = cartTotal; // Asignar el total al campo total en el documento principal
  const randomCode = generateRandomCode(4);

  // Asignar el código al campo 'codigo'
  this.codigo = randomCode;

  next(); // Continuar con el proceso de guardado
});
CartClienteSchema.methods.anular = async function () {
  // Verificar si ya está anulado
  if (this.anulado) {
    throw new Error("La venta ya está anulada.");
  }

  // Recorrer los elementos en la subcolección 'cart'
  for (const cartItem of this.cart) {
    // Buscar el repuesto por nombre en la colección 'repuestos'
    const repuesto = await Repuesto.findOne({ name: cartItem.name });

    // Si se encuentra el repuesto, incrementar la cantidad
    if (repuesto) {
      repuesto.amount += cartItem.amount;
      await repuesto.save();
    }
  }

  // Marcar la venta como anulada
  this.anulado = true;
  await this.save();
};

const CartClienteModel = mongoose.model("CartCliente", CartClienteSchema);

export default CartClienteModel;
