import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import createAccessToken from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import { secretKey } from "../config.js";
import nodemailer from "nodemailer";

// Función para generar una cadena aleatoria de una longitud específica
function generateRandomToken(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  return token;
}

export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const userFound = await User.findOne({ email }); // para validar en el frontend si el usuario ya existe
    if (userFound) {
      return res.status(400).json({message:["el correo ya existe"]});
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
    // res.cookie("token", token);
    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });

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
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });
    if (!userFound)return res.status(400).json({ message: ["Usuario no encontrado"] });

    const isMatch = await bcrypt.compare(password, userFound.password); // comparemelo con la contraseña que acaba de ingresar el usuario con la otra que esta guardada en la base de datos
    if (!isMatch)
      return res.status(400).json({ message: ["Contraseña incorrecta"] });

    const token = await createAccessToken({
      id: userFound._id,
      username: userFound.username,
    }); // del usuario encontrado creeme un token con el id del usuario encontrado

    //tokent frontend y backend
    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });
    // res.cookie("token", token)
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

export const profile = async (req, res) => {
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

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.send(false);

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return res.sendStatus(401);

    const userFound = await User.findById(user.id);
    if (!userFound) return res.sendStatus(401);

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  });
};

export const enviarToken = async (req, res) => {

  try {
      const { email } = req.body;

      // Verificar si el correo electrónico existe en la base de datos
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: ["Email no registrado"] });
      }

      // Generar un token con una duración limitada
      const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
      
      const randomToken = generateRandomToken(5);
      console.log(randomToken);

      // Almacenar el token en el usuario en la base de datos
      user.resetToken = token;
      user.resetTokenExpires = new Date(Date.now() + 3600000); // 1 hora de expiración
      user.code = randomToken;
      await user.save();

      // Almacenar el token en una cookie
      res.cookie('token2', token, { httpOnly: true });

      // Enviar un correo electrónico con el enlace de recuperación
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'saritalop789@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'wklw ynoh rtnc baej',
        },
      });
      const code = randomToken
      const resetLink = `http://localhost:3000/api/restablecer-password/${token}`;
      const mailOptions = {
        to: email,
        subject: 'Recuperación de contraseña',
        html: `Su codigo de recuperacion es: <p>${code}</p>`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Error al enviar el correo electrónico' });
        }
        console.log('Correo electrónico enviado:', info.response);
        res.status(200).json({ message: 'Correo electrónico enviado con éxito' });
      });
 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }

};


export const validarToken = async (req, res) => {
  // const token = req.params.token;
  const code = req.params.code;

  try {
    const usuario = await User.findOne({ code: code });

    // Decodificar el token para obtener la información del usuario
    // const decodedToken = jwt.verify(token, 'secreto'); // Reemplaza la clave secreta utilizada para firmar el token

    // Buscar al usuario en la base de datos usando la información del token
    // const usuario = await User.findOne({ _id: decodedToken.userId });
    console.log(usuario)
    if (!usuario) {
      return res.status(400).json({ message: "Código no válido" });
    }

    // Devolver la información del usuario en formato JSON
    return res.status(200).json({
      username: usuario.username,
      email: usuario.email,
      password: usuario.password,
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt,
      resetTokenExpires: usuario.resetTokenExpires
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: ["codigo inválido"] });
  }
};

export const actualizarPassword = async (req, res) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  console.log("Contraseña:", password, "Confirmar contraseña:", confirmPassword);
  console.log("Cuerpo de la solicitud:", req.body);
  try {
      console.log("Código recibido:", req.params.code); 
    // Verificar el token según la fecha de expiración
    const usuario = await User.findOne({
      code: req.params.code,
      // resetToken: req.params.token,
      resetTokenExpires: { $gt: Date.now() },
    });
    console.log(usuario);

    // Verificar que el usuario exista
    if (!usuario) {
      return res.status(400).json({ message: ["codigo inválido o expirado"] });
    }

   
    // Verificar que se proporciona una nueva contraseña y que coincide con la confirmación
    
    console.log("Contraseña:", password, "Confirmar contraseña:", confirmPassword);


    if (!password || !confirmPassword || password !== confirmPassword) {
      console.error("Las contraseñas no coinciden");
      return res.status(400).json({
        message: ["Las contraseñas no coinciden"]
      });
    }
    

    // Generar el hash de la nueva contraseña
    const newPasswordHash = await bcrypt.hash(req.body.password, 10);

    // Blanqueando los parámetros
    usuario.resetToken = null;
    usuario.resetTokenExpires = null;
    usuario.password = newPasswordHash;
    usuario.code = null;

    // Guardar la nueva contraseña encriptada
    await usuario.save();

    return res.status(200).json({ message: "Contraseña actualizada con éxito" });
  } catch (error) {
    console.error(error);
    console.error("Error en la solicitud de actualizar contraseña:", error);
    return res.status(500).json({ message:[ "Error interno del servidor"] });
  }
};
