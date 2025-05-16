const { enviarCorreo } = require('./src/utils/mailer');

enviarCorreo(
  'josuebaxin38@gmail.com', // puedes poner el tuyo aquí
  'Prueba de verificación',
  '<h1>¡Funciona Nodemailer!</h1><p>Este es un correo de prueba.</p>'
);
