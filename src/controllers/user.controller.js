import User from "../models/user.model.js";
import Rol from "../models/rols.model.js"
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";


// Controlador para crear un nuevo usuario
export const createUsuario = async (req, res) => {
  const { email, password, username , estado, rol} = req.body;
 
  try {
    
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
    
    try {
      const userSaved = await newUser.save();

      // Aquí puedes manejar el envío del correo electrónico
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
            return res.status(500).json({ message: ['Error al enviar el correo electrónico'] });
          }
          // Envía una respuesta al cliente después de enviar el correo electrónico
          res.status(201).json(userSaved);
        });

      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};



// Controlador para obtener todos los usuarios
export const getUsuarios = async (req, res) => {
    try {
      const users = await User.find().populate({ path: 'rol', select: 'name' });
    if(!users){
      return res.status(404).json({message: ["user no enconreados"]})
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
      const updatedUser = await User.findByIdAndUpdate(req.params.id,req.body, { new: true });
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
  