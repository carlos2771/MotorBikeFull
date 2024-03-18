import User from "../models/user.model.js";
import Rol from "../models/rols.model.js"
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";


// Controlador para crear un nuevo usuario
export const createUsuario = async (req, res) => {
  try {
    const { email, password, username , estado, rol} = req.body;
    
    const userFound = await User.findOne({ email });
    if (userFound) {
      return res.status(400).json({ message:["El correo electrónico ya está registrado"] });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Si hay errores de validación, responder con un código 400 y los mensajes de error
    if (!email || !password || !username) {
      return res.status(400).json({ message: ["Datos incompletos"] });
    }

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: passwordHash,
      estado: req.body.estado, 
      rol: req.body.rol
    });
    
    const userSaved = await newUser.save();
    res.status(201).json(userSaved)
    

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};



// Controlador para obtener todos los usuarios
export const getUsuarios = async (req, res) => {
    try {
      const users = await User.find().populate({ path: 'rol', select: 'name' });
    if(!users){
      return res.status(404).json({message: ["user no encontrados"]})
    }
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Controlador para obtener un usuario por su ID
  export const getUsuario = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) {
      
        return res.status(404).json({ message: ["Usuario no encontrado"] });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
 // Controlador para actualizar un usuario
export const updateUsuario = async (req, res) => {
  try {
    const { email } = req.body;

    // Busca el usuario que se está actualizando
    const userToUpdate = await User.findById(req.params.id);

    // Verifica si el usuario existe
    if (!userToUpdate) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Si el correo electrónico se está actualizando
    if (email !== userToUpdate.email) {
      // Verifica si el correo electrónico ya está registrado en otro usuario
      const userFound = await User.findOne({ email });
      if (userFound) {
        return res.status(400).json({ message: ["El correo electrónico ya está registrado"] });
      }
    }

    // Actualiza el usuario
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  
  // Controlador para eliminar un usuario
  export const deleteUsuario = async (req, res) => {
    const { id } = req.params;
    try {
      await User.findByIdAndDelete(id);
      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  