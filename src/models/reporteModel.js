// src/models/reporteModel.js
const mongoose = require('mongoose');

const reporteSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  categoria: { type: String, required: true },
  direccion: { type: String, required: true },
  latitud: { type: Number, required: true },
  longitud: { type: Number, required: true },
  imagen: { type: String }, // base64
  estado: { type: String, enum: ['pendiente', 'en_progreso', 'resuelto'], default: 'pendiente' },
  enviado_en: { type: Date, default: Date.now },
  actualizado_en: { type: Date, default: Date.now },
});

const Reporte = mongoose.model('Reporte', reporteSchema);

module.exports = Reporte;

const crearReporte = async ({
  usuario_id,
  titulo,
  descripcion,
  categoria,
  direccion,
  latitud,
  longitud,
  imagenBase64
}) => {
  try {
    const nuevoReporte = new Reporte({
      usuario_id,
      titulo,
      descripcion,
      categoria,
      direccion,
      latitud,
      longitud,
      imagen: imagenBase64
    });

    await nuevoReporte.save();
    return nuevoReporte;
  } catch (error) {
    console.error('❌ Error al crear el reporte:', error);
    throw error;
  }
};

const obtenerReportesPorUsuario = async (usuario_id) => {
  return await Reporte.find({ usuario_id }).sort({ enviado_en: -1 });
};

const obtenerReportePorId = async (id) => {
  const reporte = await Reporte.findById(id);
  return reporte ? reporte.toObject() : null;
};

module.exports = {
  crearReporte,
  obtenerReportesPorUsuario,
  obtenerReportePorId
};
