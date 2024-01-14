import mongoose from "mongoose";

const CartClienteSchema = new mongoose.Schema({
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: "clientes" },
    cart: [{
        cartItem: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
        name: { type: String },
        img: { type: String },
        amount: { type: Number},
        price: { type: Number },
    }]
});

const CartClienteModel = mongoose.model("CartCliente", CartClienteSchema);

export default CartClienteModel;
