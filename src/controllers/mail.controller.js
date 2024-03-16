import nodemailer from "nodemailer";

const mail = {
  user: "cadiaz5209@misena.edu.co",
  pass: "rkgt oqew jlxj oqnc",
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Cambiado a true para usar SSL
  auth: {
    user: mail.user,
    pass: mail.pass,
  },
});

export const sendEmail = async (email, subject, html) => {
  try {
    await transporter.sendMail({
      from: `${mail.user}`, // dirección del remitente
      to: email,
      subject,
      text: `${email}`, // cuerpo de texto plano
      html,
    });
  } catch (error) {
  }
};

export const getTemplate = (name, email) => {
  return `
    <head>
        <link rel="stylesheet" href="./style.css">
    </head>
    
    <div id="email___content">
        <img src="https://i.pinimg.com/236x/ff/bd/9f/ffbd9f4c516a613944f8bcd014948b64.jpg" alt="">
        <h2>Hola ${name}🏍⭐</h2>
        <h3>Bienvenido a motor bike</h3>
        <p>El correo electronico: ${email} fue registrado con exito✅ </p>
    </div>
  `;
};

