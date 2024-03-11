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

const adjustToColombiaTime = (date) => {
  // Ajuste en minutos para Colombia (UTC-5)
  const utcOffset = -300; // 5 hours * 60 minutes
  return new Date(date.getTime() + utcOffset * 60000);
};

const CartClienteSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: "clientes" },
  cart: [
    {
      cartItem: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
      name: { type: String },
      amount: { type: Number },
      price: { type: Number },
    },
  ],
  total: { type: Number },
  codigo: { type: String },
  descuento: {
    type: Number,
    default: 0
  },
  anulado: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

CartClienteSchema.pre("save", function (next) {
  const cartTotal = this.cart.reduce(
    (acc, cartItem) => acc + cartItem.amount * cartItem.price,
    0
  );
  
  // Calcula el descuento en porcentaje
  const discountPercentage = this.descuento / 100;

  // Calcula el descuento aplicado al total
  const discountAmount = cartTotal * discountPercentage;

  // Resta el descuento al total
  this.total = cartTotal - discountAmount;

  const randomCode = generateRandomCode(4);
  this.codigo = randomCode;

  // Ajustar la hora al huso horario de Colombia antes de guardar
  this.createdAt = adjustToColombiaTime(this.createdAt);

  next();
});


CartClienteSchema.methods.anular = async function () {
  if (this.anulado) {
    throw new Error("La venta ya está anulada.");
  }

  for (const cartItem of this.cart) {
    const repuesto = await Repuesto.findOne({ name: cartItem.name });

    if (repuesto) {
      repuesto.amount += cartItem.amount;
      await repuesto.save();
    }
  }

  this.anulado = true;
  await this.save();
};

const CartClienteModel = mongoose.model("CartCliente", CartClienteSchema);

export default CartClienteModel;
