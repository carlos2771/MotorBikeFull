import nodemailer from 'nodemailer';

// Función para enviar correo electrónico de manera asíncrona
export const enviarEmail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'saritalop789@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'wklw ynoh rtnc baej',
      },
    });

    const mailOptions = {
      to: email,
      subject: subject,
      html: html,
      attachments: [
        { filename: 'motorbike.png', path: 'src/public/images/motorbike.png', cid: 'motorbike' },
        { filename: 'facebook.png', path: 'src/public/images/facebook.png', cid: 'facebook' },
        { filename: 'instagram.png', path: 'src/public/images/instagram.png', cid: 'instagram' },
        { filename: 'whatsapp.png', path: 'src/public/images/whatsapp.png', cid: 'whatsapp' },
        { filename: 'email.png', path: 'src/public/images/email.png', cid: 'email' },
      ]
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
  }
};

// Función para generar el HTML del correo electrónico de recuperación de contraseña
export const generatePasswordRecoveryEmailHTML = (code) => {
    return `<!DOCTYPE html>
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
                        Por favor presiona el siguiente boton para continuar con el proceso de recuperacion.
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
    </html>`;
  };
  
  // Función para generar el HTML del correo electrónico de contraseña actualizada
  export const generatePasswordUpdatedEmailHTML = () => {
    return `<!DOCTYPE html>
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
    </html>`;
  };
  