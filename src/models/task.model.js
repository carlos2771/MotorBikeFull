import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    user:{
      type: mongoose.Schema.Types.ObjectId, //para traer el _id
      ref: "usuarios", 
      required: true
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("tasks", taskSchema)
