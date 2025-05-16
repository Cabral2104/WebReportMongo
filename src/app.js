// src/app.js

// 🔹 Cargar variables de entorno
require('dotenv').config();

// 🔹 Requerir dependencias
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const conectarDB = require('./database');
conectarDB(); // Conecta a MongoDB al iniciar


// 🔹 Inicializar app
const app = express();
// Usar la variable de entorno
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

app.get('/config', (req, res) => {
  res.json({ googleMapsApiKey }); // Enviar la clave al frontend
});

// 🔹 Cargar configuración de Passport (estrategia Google, serialización, etc.)
require('./utils/passport');

// 🔹 Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔹 Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'mi_secreto',
  resave: false,
  saveUninitialized: false,
}));

// 🔹 Inicializar Passport y soporte para sesiones
app.use(passport.initialize());
app.use(passport.session());

// 🔹 Servir archivos estáticos (html, css, js, etc.)
app.use(express.static(path.join(__dirname, '../')));

// 🔹 Rutas
const authRoutes = require('./routes/authRoutes'); // Asegúrate de que el archivo sea `authRoutes.js`

const reportesRoutes = require('./routes/reportesRoutes');
app.use('/', reportesRoutes);


app.use('/auth', authRoutes); // Ruta base para autenticación

// 🔹 Puerto del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
