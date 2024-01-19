import mongoose from "mongoose";
const CartSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    img: { type: String },
    amount: { type: Number, required: true },
    price: { type: Number, required: true },
    
  });

export default mongoose.model("Cart",CartSchema)