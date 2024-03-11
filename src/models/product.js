import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    img: { type: String, },
    inCart: { type: Boolean, default: false },
    price: { type: Number, required: true },
  });

export default mongoose.model("Product", ProductSchema)