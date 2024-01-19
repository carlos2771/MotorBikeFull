import mongoose from "mongoose";

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

const CartClienteModel = mongoose.model("CartCliente", CartClienteSchema);

export default CartClienteModel;
