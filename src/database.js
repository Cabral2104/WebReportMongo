// src/database.js

require('dotenv').config();  // Asegúrate de que las variables de entorno se carguen correctamente
const { Pool } = require('pg');  // Requiere el paquete de PostgreSQL

// Construir la URL de conexión con los datos del archivo .env
const pool = new Pool({
  host: process.env.DB_HOST,  // localhost
  port: process.env.DB_PORT,  // 5432
  user: process.env.DB_USER,  // postgres
  password: process.env.DB_PASSWORD,  // PáginaWeb
  database: process.env.DB_NAME,  // portal_reportes
});

// Exportar la conexión para que se pueda usar en otros archivos
module.exports = pool;
