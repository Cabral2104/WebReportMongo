// src/controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { enviarCorreo } = require('../utils/mailer');
const Usuario = require('../models/usuario');

const FRONTEND_URL = process.env.FRONTEND_URL;
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Registro de usuario + correo de bienvenida
 */
async function register(req, res) {
  const { nombre, apellido, localidad, telefono, correo, contraseña } = req.body;

  try {
    if (!nombre || !apellido || !localidad || !correo || !contraseña) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }

    // Verificar si ya existe el correo
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'Ese correo ya está registrado.' });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(contraseña, salt);

    // Crear usuario
    const nuevoUsuario = new Usuario({
      nombre,
      apellido,
      localidad,
      telefono,
      correo,
      contraseña: hashPass
    });
    await nuevoUsuario.save();

    // Enviar correo
    const asunto = '¡Bienvenido a Sistema de Reportes Ciudadanos!';
    const html = `
      <h2>Hola ${nuevoUsuario.nombre} 👋</h2>
      <p>Gracias por registrarte en nuestro sistema de reportes ciudadanos.</p>
      <p>Ahora puedes iniciar sesión y empezar a enviar reportes.</p>
      <hr/>
      <p>Un saludo,<br>El equipo del Sistema de Reportes Ciudadanos</p>
    `;
    await enviarCorreo(nuevoUsuario.correo, asunto, html);

    return res.status(201).json({
      mensaje: 'Registro exitoso. Te hemos enviado un correo de bienvenida.'
    });

  } catch (error) {
    console.error('Error en register:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
}

/**
 * Login con JWT
 */
async function login(req, res) {
  const { correo, contraseña } = req.body;
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errors: errores.array() });
  }

  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const passwordValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: usuario._id, correo: usuario.correo },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      success: true,
      mensaje: 'Login exitoso',
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo
      },
      token
    });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

/**
 * Recuperación de contraseña
 */
async function forgotPassword(req, res) {
  const { correo } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Correo no registrado.' });
    }

    const token = jwt.sign({ id: usuario._id }, JWT_SECRET, { expiresIn: '15m' });
    usuario.token_verificacion = token;
    await usuario.save();

    const resetLink = `${FRONTEND_URL}/pages/reset-password.html?token=${token}`;

    const asunto = 'Recupera tu contraseña';
    const html = `
      <h2>Hola ${usuario.nombre},</h2>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetLink}">${resetLink}</a>
      <hr/>
      <p>Este enlace expira en 15 minutos.</p>
    `;
    await enviarCorreo(correo, asunto, html);

    return res.json({ mensaje: 'Correo enviado con instrucciones para restablecer tu contraseña.' });

  } catch (error) {
    console.error('Error en forgotPassword:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
}

/**
 * Restablecimiento de contraseña
 */
async function resetPassword(req, res) {
  const { token, nuevaContrasena } = req.body;

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    const usuario = await Usuario.findById(payload.id);
    if (!usuario || usuario.token_verificacion !== token) {
      return res.status(400).json({ mensaje: 'Token inválido o expirado.' });
    }

    const salt = await bcrypt.genSalt(10);
    usuario.contraseña = await bcrypt.hash(nuevaContrasena, salt);
    usuario.token_verificacion = null;
    await usuario.save();

    return res.json({ mensaje: 'Contraseña restablecida correctamente.' });

  } catch (error) {
    console.error('Error en resetPassword:', error);
    return res.status(400).json({ mensaje: 'Token inválido o expirado.' });
  }
}

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword
};
