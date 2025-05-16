// src/controllers/reportesController.js

const mongoose = require('mongoose');
const Reporte = require('../models/reporteModel');

const crearReporte = async (req, res) => {
  try {
    const {
      latitud,
      longitud,
      direccion,
      titulo,
      descripcion,
      categoria,
      usuario_id
    } = req.body;

    if (!latitud || !longitud || !direccion || !titulo || !descripcion || !categoria || !usuario_id) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Procesar imagen
    let imagenUrl = null;
    if (req.file) {
      imagenUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    const nuevoReporte = new Reporte({
      usuario: new mongoose.Types.ObjectId(usuario_id),
      titulo,
      descripcion,
      categoria,
      direccion,
      latitud: parseFloat(latitud),
      longitud: parseFloat(longitud),
      imagen: imagenUrl
    });

    await nuevoReporte.save();

    return res.status(201).json({
      message: "Reporte creado correctamente",
      reporte: nuevoReporte
    });

  } catch (error) {
    console.error("Error al crear el reporte:", error);
    return res.status(500).json({ error: "Error al crear el reporte" });
  }
};

const obtenerReportesPorUsuario = async (req, res) => {
  try {
    const usuarioId = req.query.usuario_id;

    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
      return res.status(400).json({ error: 'usuario_id inválido' });
    }

    const reportes = await Reporte.find({ usuario: usuarioId });
    return res.json(reportes);

  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return res.status(500).json({ error: 'Error al obtener reportes' });
  }
};

const obtenerReportePorId = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const reporte = await Reporte.findById(id);
    if (!reporte) {
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }

    return res.json(reporte);

  } catch (error) {
    console.error("Error al obtener el reporte:", error);
    return res.status(500).json({ error: 'Error al obtener el reporte' });
  }
};

module.exports = {
  crearReporte,
  obtenerReportesPorUsuario,
  obtenerReportePorId
};
