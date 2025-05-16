const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const enviarCorreo = async (para, asunto, html) => {
  const opciones = {
    from: `"Sistema de Reportes" <${process.env.EMAIL_USER}>`,
    to: para,
    subject: asunto,
    html
  };

  try {
    await transporter.sendMail(opciones);
    console.log("Correo enviado a:", para);
  } catch (error) {
    console.error("Error al enviar correo:", error);
  }
};

module.exports = { enviarCorreo };
