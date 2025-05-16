const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../models/db'); // Ajusta si tu conexión está en otra ruta

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const nombre = profile.name.givenName;
    const apellido = profile.name.familyName || '';
    const localidad = 'Desconocida'; // Valor por defecto para cumplir con NOT NULL

    // Verificar si el usuario ya existe
    const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [email]);

    if (result.rows.length > 0) {
      // Usuario ya existe
      return done(null, result.rows[0]);
    } else {
      // Crear nuevo usuario con datos mínimos y valor por defecto
      const nuevoUsuario = await pool.query(`
        INSERT INTO usuarios (nombre, apellido, correo, localidad, verificado, rol, estado, creado_en)
        VALUES ($1, $2, $3, $4, true, 'usuario', 'activo', NOW())
        RETURNING *;
      `, [nombre, apellido, email, localidad]);

      return done(null, nuevoUsuario.rows[0]);
    }
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id); // Puedes usar `user.correo` si prefieres
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});
