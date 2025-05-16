const jwt = require('jsonwebtoken');  // Importa el paquete jsonwebtoken

const verificarToken = (req, res, next) => {
    // Obtén el token desde los encabezados de la solicitud
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        // Verifica el token usando la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Guarda la información decodificada en el objeto req para usarla en las rutas
        req.user = decoded.user;
        next();  // Continúa con la siguiente función del middleware o ruta
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Token is not valid' });
    }
};

module.exports = verificarToken;
