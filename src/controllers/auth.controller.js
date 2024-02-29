import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import createAccessToken from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import { getTemplate, sendEmail } from "./mail.controller.js";
import { secretKey } from "../config.js";
import nodemailer from "nodemailer";
import base64String from "../img/base64Image.js";


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
  const { email, password, username, estado, rol } = req.body;

  try {
    const userFound = await User.findOne({ email }); // para validar en el frontend si el usuario ya existe
    if (userFound) {
      return res.status(400).json({message:["Este correo ya esta en uso"]});
    }
    const passwordHash = await bcrypt.hash(password, 10);

    if (!email || !password || !username) {
      return res.status(400).json({ message: ["Datos incompletos"] });
    }

    const newUser = new User({
      // esto es una instancia que viene del schema User es como se le coloco al schema
      username,
      email,
      password: passwordHash,
      estado, // Agregar el estado si es necesario
      rol
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

    // const template = getTemplate(username, email)
    // await sendEmail(email, "Registro de MotorBike exitoso!!👽👍", template)

    // Enviar un correo electrónico con el codigo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'saritalop789@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'wklw ynoh rtnc baej',
      },
    });

    let mensajeHTML3 = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    
        <style>
            /* fuentes de sitios */
            p, a, h1, h2, h3, h3, h5, h6 {font-family: "Roboto", sans-serif;}
    
            h1 {font-size: 30px ! important;}
            h2 {font-size: 25px ! important;}
            h3 {font-size: 18px ! important;}
            h4 {font-size: 16px ! important;}
    
            p, a {font-size: 15px ! important;}
    
            .claseBoton{
                width: 30%;
                background: linear-gradient(to right, #0f172a, #082f49, #0f172a);
                border: 2px solid rgb(255, 255, 255);
                color: white !important;
                padding: 16px 32px;
                text-align: center;
                text-decoration: none;
                font-weight: bold;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                transition-duration: 0.4s;
                cursor: pointer;
            }
    
            .claseBoton:hover{
                background: white;
                border: 2px solid rgb(14, 13, 13);
                color: rgb(0, 0, 0) !important;
            }
    
            .imag{
                width: 30px;
                height: 30px;
            }
    
            .contA{
                margin: 0px 5px 0px 5px;
            }
            .afooter{
                color: white !important;
                text-decoration: none;
                font-size: 13px !important;
            }
        </style>
    
    </head>
    <body>
        
        <div style="width: 100%; background-color: white;">
            <div style="padding: 20px 10px 20px 10px; ">
                <!-- Imagen inicial -->
                <div style="background: linear-gradient(to right, #0f172a, #082f49, #0f172a); padding: 10px 0px 10px 0px; width: 100%; text-align: center;">
                    <img src="cid:motorbike" alt="" style="width: 150px; height: 150px;">
                </div>
                <!-- Imagen inicial -->
    
                <!-- Contenido principal -->
                <div style="background-color: white; padding: 20px 0px 5px 0px; width: 100%; text-align: center;">
                    <h1 style="color: black !important;">
                        <!-- Titulo principal -->
                        ¡Bienvenido a MotorBike! Tu registro ha sido exitoso 🎉
                    </h1>
                    <h3 style="color: black !important;">
                        <strong>Detalles de tu cuenta:</strong>
                    </h3>
                    <p>
                        <strong>Nombre de usuario: </strong>${username}<br> 
                        <strong>Correo electrónico: </strong>${email} 
                    </p>

                    <!-- Mensaje de gracias -->
                    <p style="color: black !important;">¡Gracias por unirte a nosotros. Estamos emocionados de tenerte en MotorBike.!</p>
                    <p style="color: black !important;"> ¡Prepárate para explorar y disfrutar!</p>
                    <p style="margin-bottom: 50px; color: black !important;"><i>Atentamente:</i> <br>Soporte Técnico</p>
    
                    <!-- Boton -->
                    
                    <p style="color: black !important;">Para comenzar, puedes iniciar sesión haciendo clic en el siguiente enlace:</p>
                    <a class="claseBoton" href="http://localhost:5173/login">Inicia sesion Aqui!</a>
                </div>
                <!-- Contenido principal -->
    
    
                <!-- Footer -->
                <div style="background: linear-gradient(to right, #0f172a, #082f49, #0f172a); color: white; padding: 5px 0px 0px 0px; width: 100%; text-align: center;">
    
                    <!-- Redes sociales -->
                    <br>
                    <a href="https://wa.me/573004020129" class="contA"><img src="cid:whatsapp" class="imag"></a>
                    <a href="https://www.facebook.com/" class="contA"><img src="cid:facebook" class="imag"></a>
                    <a href="https://www.instagram.com
                    " class="contA"><img src="cid:instagram" class="imag"></a>
                    <a href="https://mail.google.com/" class="contA"><img src="cid:email" class="imag"></a>
    
                    <!-- Redes sociales -->
    
                    <h3><i>Soporte</i></h3>
                    <p style="font-size: 13px; padding: 0px 20px 0px 20px;">
                        Comunicate con nostros por los siguientes medios: <br>
                        Correo: <a href="mailto:saritalop789@gmail.com" class="afooter">Motorbike@moto.com</a><br>
                        Whatsapp: <a href="https://wa.me/573004020129" class="afooter">+57 - 3004020129</a>
                    </p>
                    <p style="background-color: black; padding: 10px 0px 10px 0px; font-size: 12px;">© 2023 Motorbike, Todos los derechos reservados</p>
    
    
                </div>
            </div>
        </div>
    
    </body>
    </html>`
    const mailOptions = {
      to: email,
      subject: 'Bienvenido a Motorbike',
      html: mensajeHTML3,
      attachments: [
        {
          filename: 'motorbike.png',
          path : 'src/public/images/motorbike.png',
          cid: 'motorbike' 
        },
        {
          filename: 'facebook.png',
          path : 'src/public/images/facebook.png',
          cid: 'facebook' 
        },
        {
          filename: 'instagram.png',
          path : 'src/public/images/instagram.png',
          cid: 'instagram' 
        },
        {
          filename: 'whatsapp.png',
          path : 'src/public/images/whatsapp.png',
          cid: 'whatsapp' 
        },
        {
          filename: 'email.png',
          path : 'src/public/images/email.png',
          cid: 'email' 
        },

      ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al enviar el correo electrónico' });
      }
      console.log('Correo electrónico enviado:', info.response);
      res.status(200).json({ message: 'Correo electrónico enviado con éxito' });
    });

    res.json({
      // respuesta en json para el thunder, solo quiero mostrar los siguientes datos y para que el frontend lo use
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      estado: userSaved.estado,
      rol: userSaved.rol,
      createdAt: userSaved.createdAt,
      updateAt: userSaved.updatedAt,
    });

    console.log(newUser);
    console.log("Este es el new user",newUser.rol)

    
  } catch (error) {
    console.log("errir",error)
    res.status(500).json({ message: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password, rol } = req.body;
    const userFound = await User.findOne({ email }).populate('rol');
    if (!userFound) return res.status(400).json({ message: ["Usuario no encontrado"] });
    if (userFound.estado === "Inactivo")
      return res.status(400).json({ message: ["El usuario está inactivo"] });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ message: ["Usuario/Contraseña incorrecto"] });

    const token = await createAccessToken({
      id: userFound._id,
      username: userFound.username,
      rol: {
        name: userFound.rol.name,
        permissions: userFound.rol.permissions
      },
    });

    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });
    res.cookie("token", token)

    // Ahora, además de devolver el rol, devolvemos los permisos asociados a ese rol
    res.json({
      username: userFound.username,
      email: userFound.email,
      rol: {
        name: userFound.rol.name,
        permissions: userFound.rol.permissions
      },
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
    console.log("el roll", rol);
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

      // Enviar un correo electrónico con el codigo
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'saritalop789@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'wklw ynoh rtnc baej',
        },
      });
      const code = randomToken
      let mensajeHTML = `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
      
          <style>
              /* fuentes de sitios */
              p, a, h1, h2, h3, h3, h5, h6 {font-family: "Roboto", sans-serif;}
      
              h1 {font-size: 30px ! important;}
              h2 {font-size: 25px ! important;}
              h3 {font-size: 18px ! important;}
              h4 {font-size: 16px ! important;}
      
              p, a {font-size: 15px ! important;}
      
              .claseBoton{
                  width: 30%;
                  background: linear-gradient(to right, #0f172a, #082f49, #0f172a);
                  border: 2px solid rgb(255, 255, 255);
                  color: white !important;
                  padding: 16px 32px;
                  text-align: center;
                  text-decoration: none;
                  font-weight: bold;
                  display: inline-block;
                  font-size: 16px;
                  margin: 4px 2px;
                  transition-duration: 0.4s;
                  cursor: pointer;
              }
      
              .claseBoton:hover{
                  background: white;
                  border: 2px solid rgb(14, 13, 13);
                  color: rgb(0, 0, 0) !important;
              }
      
              .imag{
                  width: 30px;
                  height: 30px;
              }
      
              .contA{
                  margin: 0px 5px 0px 5px;
              }
              .afooter{
                  color: white !important;
                  text-decoration: none;
                  font-size: 13px !important;
              }
          </style>
      
      </head>
      <body>
          
          <div style="width: 100%; background-color: white;">
              <div style="padding: 20px 10px 20px 10px; ">
                  <!-- Imagen inicial -->
                  <div style="background: linear-gradient(to right, #0f172a, #082f49, #0f172a); padding: 10px 0px 10px 0px; width: 100%; text-align: center;">
                      <img src="cid:motorbike" alt="" style="width: 150px; height: 150px;">
                  </div>
                  <!-- Imagen inicial -->
      
                  <!-- Contenido principal -->
                  <div style="background-color: white; padding: 20px 0px 5px 0px; width: 100%; text-align: center;">
                      <h1 style="color: black !important;">
                          <!-- Titulo principal -->
                          Recuperación de Contraseña
                      </h1>
                      <p style="color: black !important;">
                          Hemos recibido tu petición sobre el reestablecimiento de tu contraseña
                      </p>
                      <p>
                      Su código de recuperación es: <strong>${code}</strong>
                      </p>
      
                      <!-- Mensaje de gracias -->
                      <p style="color: black !important;">¡gracias por su tiempo!</p>
                      <p style="margin-bottom: 50px; color: black !important;"><i>Atentamente:</i> <br>Soporte Técnico</p>
      
                      <!-- Boton -->
      
                      <a class="claseBoton" href="http://localhost:5173/reestablecer-password/${code}">Recuperar</a>
                  </div>
                  <!-- Contenido principal -->
      
      
                  <!-- Footer -->
                  <div style="background: linear-gradient(to right, #0f172a, #082f49, #0f172a); color: white; padding: 5px 0px 0px 0px; width: 100%; text-align: center;">
      
                      <!-- Redes sociales -->
                      <br>
                      <a href="https://wa.me/573004020129" class="contA"><img src="cid:whatsapp" class="imag"></a>
                      <a href="https://www.facebook.com/" class="contA"><img src="cid:facebook" class="imag"></a>
                      <a href="https://www.instagram.com
                      " class="contA"><img src="cid:instagram" class="imag"></a>
                      <a href="https://mail.google.com/" class="contA"><img src="cid:email" class="imag"></a>
      
                      <!-- Redes sociales -->
      
                      <h3><i>Soporte</i></h3>
                      <p style="font-size: 13px; padding: 0px 20px 0px 20px;">
                          Comunicate con nostros por los siguientes medios: <br>
                          Correo: <a href="mailto:saritalop789@gmail.com" class="afooter">Motorbike@moto.com</a><br>
                          Whatsapp: <a href="https://wa.me/573004020129" class="afooter">+57 - 3004020129</a>
                      </p>
                      <p style="background-color: black; padding: 10px 0px 10px 0px; font-size: 12px;">© 2023 Motorbike, Todos los derechos reservados</p>
      
      
                  </div>
              </div>
          </div>
      
      </body>
      </html>`
      const mailOptions = {
        to: email,
        subject: 'Recuperación de contraseña',
        html: mensajeHTML,
        attachments: [
          {
            filename: 'motorbike.png',
            path : 'src/public/images/motorbike.png',
            cid: 'motorbike' 
          },
          {
            filename: 'facebook.png',
            path : 'src/public/images/facebook.png',
            cid: 'facebook' 
          },
          {
            filename: 'instagram.png',
            path : 'src/public/images/instagram.png',
            cid: 'instagram' 
          },
          {
            filename: 'whatsapp.png',
            path : 'src/public/images/whatsapp.png',
            cid: 'whatsapp' 
          },
          {
            filename: 'email.png',
            path : 'src/public/images/email.png',
            cid: 'email' 
          },

        ]
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
  const code = req.params.code;
  console.log('Código recibido:', code);
  try {
    const usuario = await User.findOne({ code: code });

    if (!usuario) {
      return res.status(404).json({ message: "Código no encontrado" });
    }

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
    return res.status(500).json({ message: "Error interno del servidor" });
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

      // Enviar un correo electrónico con el mensaje de exito
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'saritalop789@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'wklw ynoh rtnc baej',
        },
      });

      let messageHTML2 = `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
      
          <style>
              /* fuentes de sitios */
              p, a, h1, h2, h3, h3, h5, h6 {font-family: "Roboto", sans-serif;}
      
              h1 {font-size: 30px ! important;}
              h2 {font-size: 25px ! important;}
              h3 {font-size: 18px ! important;}
              h4 {font-size: 16px ! important;}
      
              p, a {font-size: 15px ! important;}
      
              .claseBoton{
                  width: 30%;
                  background: linear-gradient(to right, #0f172a, #082f49, #0f172a);
                  border: 2px solid rgb(255, 255, 255);
                  color: white !important;
                  padding: 16px 32px;
                  text-align: center;
                  text-decoration: none;
                  font-weight: bold;
                  display: inline-block;
                  font-size: 16px;
                  margin: 4px 2px;
                  transition-duration: 0.4s;
                  cursor: pointer;
              }
      
              .claseBoton:hover{
                  background: white;
                  border: 2px solid rgb(14, 13, 13);
                  color: rgb(0, 0, 0) !important;
              }
      
              .imag{
                  width: 30px;
                  height: 30px;
              }
      
              .contA{
                  margin: 0px 5px 0px 5px;
              }
              .afooter{
                  color: white !important;
                  text-decoration: none;
                  font-size: 13px !important;
              }
          </style>
      
      </head>
      <body>
          
          <div style="width: 100%; background-color: white;">
              <div style="padding: 20px 10px 20px 10px; ">
                  <!-- Imagen inicial -->
                  <div style="background: linear-gradient(to right, #0f172a, #082f49, #0f172a); padding: 10px 0px 10px 0px; width: 100%; text-align: center;">
                      <img src="cid:motorbike" alt="" style="width: 150px; height: 150px;">
                  </div>
                  <!-- Imagen inicial -->
      
                  <!-- Contenido principal -->
                  <div style="background-color: white; padding: 20px 0px 5px 0px; width: 100%; text-align: center;">
                      <h1 style="color: black !important;">
                          <!-- Titulo principal -->
                          Recuperación de Contraseña Exitosa!!
                      </h1>
                      <p style="color: black !important;">
                          Hemos reestablecido su contraseña correctamente
                      </p>

                      <!-- Mensaje de gracias -->
                      <p style="color: black !important;">¡gracias por su tiempo!</p>
                      <p style="margin-bottom: 50px; color: black !important;"><i>Atentamente:</i> <br>Soporte Técnico</p>
      
                      <!-- Boton -->
      
                      <a class="claseBoton" href="http://localhost:5173/login">Iniciar sesion</a>
                  </div>
                  <!-- Contenido principal -->
      
      
                  <!-- Footer -->
                  <div style="background: linear-gradient(to right, #0f172a, #082f49, #0f172a); color: white; padding: 5px 0px 0px 0px; width: 100%; text-align: center;">
      
                      <!-- Redes sociales -->
                      <br>
                      <a href="https://wa.me/573004020129" class="contA"><img src="cid:whatsapp" class="imag"></a>
                      <a href="https://www.facebook.com/" class="contA"><img src="cid:facebook" class="imag"></a>
                      <a href="https://www.instagram.com
                      " class="contA"><img src="cid:instagram" class="imag"></a>
                      <a href="https://mail.google.com/" class="contA"><img src="cid:email" class="imag"></a>
      
                      <!-- Redes sociales -->
      
                      <h3><i>Soporte</i></h3>
                      <p style="font-size: 13px; padding: 0px 20px 0px 20px;">
                          Comunicate con nostros por los siguientes medios: <br>
                          Correo: <a href="mailto:saritalop789@gmail.com" class="afooter">Motorbike@moto.com</a><br>
                          Whatsapp: <a href="https://wa.me/573004020129" class="afooter">+57 - 3004020129</a>
                      </p>
                      <p style="background-color: black; padding: 10px 0px 10px 0px; font-size: 12px;">© 2023 Motorbike, Todos los derechos reservados</p>
      
      
                  </div>
              </div>
          </div>
      
      </body>
      </html>`
      
      const mailOptions = {
        to: usuario.email,
        subject: 'Recuperación de contraseña',
        html: messageHTML2,
        attachments: [
          {
            filename: 'motorbike.png',
            path : 'src/public/images/motorbike.png',
            cid: 'motorbike' 
          },
          {
            filename: 'facebook.png',
            path : 'src/public/images/facebook.png',
            cid: 'facebook' 
          },
          {
            filename: 'instagram.png',
            path : 'src/public/images/instagram.png',
            cid: 'instagram' 
          },
          {
            filename: 'whatsapp.png',
            path : 'src/public/images/whatsapp.png',
            cid: 'whatsapp' 
          },
          {
            filename: 'email.png',
            path : 'src/public/images/email.png',
            cid: 'email' 
          },

        ]
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Error al enviar el correo electrónico' });
        }
        console.log('Correo electrónico enviado:', info.response);
        res.status(200).json({ message: 'Correo electrónico enviado con éxito' });

    return res.status(200).json({ message: "Contraseña actualizada con éxito" });
    });
  } catch (error) {
    console.error(error);
    console.error("Error en la solicitud de actualizar contraseña:", error);
    return res.status(500).json({ message:[ "Error interno del servidor"] });
  }
};


