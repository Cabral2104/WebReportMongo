const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  crearReporte,
  obtenerReportesPorUsuario,
  obtenerReportePorId
} = require('../controllers/reportesController');

// Configurar multer para recibir la imagen en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /reportes → crear un nuevo reporte
router.post('/', upload.single('imagen'), crearReporte);

// GET /reportes/:id → obtener un reporte por ID
router.get('/:id', obtenerReportePorId);

// GET /reportes?usuario_id=123 → obtener todos los reportes de ese usuario
router.get('/', obtenerReportesPorUsuario);

module.exports = router;
