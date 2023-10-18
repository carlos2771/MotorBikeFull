import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import createAccessToken from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {

     const userFound = await User.findOne({email}) // para validar en el frontend si el usuario ya existe 
     if(userFound){
      return res.status(400).json(["el correo ya existe"])
     }
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      // esto es una instancia que viene del schema User es como se le coloco al schema
      username,
      email,
      password: passwordHash,
    });

    const userSaved = await newUser.save();
    // esta parte es para traer el token
    const token = await createAccessToken({ id: userSaved._id });
    res.cookie("token", token);
    res.json({
      // respuesta en json para el thunder, solo quiero mostrar los siguientes datos y para que el frontend lo use
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updateAt: userSaved.updatedAt,
    });

    console.log(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound)
      return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, userFound.password); // comparemelo con la contraseña que acaba de ingresar el usuario con la otra que esta guardada en la base de datos
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = await createAccessToken({ id: userFound._id }); // del usuario encontrado creeme un token con el id del usuario encontrado

    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",});
    res.json({
      // respuesta en json para el thunder, solo quiero mostrar los siguientes datos y para que el frontend lo use
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updateAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    // este nombre token sale de res.coockie
    expires: new Date(0), // tiempo de expiracion
  });
  return res.sendStatus(200);
};

export const profile = async(req, res) => {
  const userFound = await User.findById(req.user.id);
  if (!userFound) return res.status(400).json({ message: "User not found" });

  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    createdAt: userFound.createdAt,
    updateAt: userFound.updatedAt,
  });
  // console.log(req.user); // para ver el token del usuario, que se trae de validateToken
  // res.send("profile");
};

export const verifyToken = async(req, res) =>{
  const {token} = req.cookies
  if(!token) return res.status(401).json({message: "no autorizado"})
  
  jwt.verify(token, TOKEN_SECRET, async(err, user)=>{
    if(err) return res.status(401).json({message: "no autorizado"})

    const userFound = await User.findById(user.id)
    if(!userFound) return res.status(401).json({message: "no autorizado"})

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  })
}