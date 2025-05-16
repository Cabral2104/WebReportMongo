// src/models/usuario.js
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },

  apellido: { 
    type: String,
    required: true,
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  telefono: {
    type: String,
    required: false
  },
  localidad: {
    type: String,
    required: false
  },
  contraseña: {
    type: String,
    required: true
  },
  reset_token: {
    type: String
  },
  reset_token_expiration: {
    type: Date
  },
  googleId: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UsuarioMongo', usuarioSchema);
