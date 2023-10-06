import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      // esto es una instancia que viene del schema User es como se le coloco al schema
      username,
      email,
      password: passwordHash,
    });

    const userSaved = await newUser.save();

    jwt.sign( // para el token
      {
      id: userSaved._id,
     },
     "secret123",
     {
      expiresIn: "1d",
     },
     (err, token) =>{
      if (err) console.log(err);
      res.cookie("token", token)
      res.json({
        message: "usuario creado "
      })
     }
     )

    // res.json({ 
    //   // respuesta en json para el thunder, solo quiero mostrar los siguientes datos y para que el frontend lo use
    //   id: userSaved._id,
    //   username: userSaved.username,
    //   email: userSaved.email,
    //   createdAt: userSaved.createdAt,
    //   updateAt: userSaved.updatedAt,
    // });

    console.log(newUser);
  } catch (error) {
    console.log("error al guardar datos", error);
  }
};

export const login = (req, res) => res.send("login");
