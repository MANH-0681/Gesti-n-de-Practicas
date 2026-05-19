const esAdministrador = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ message: "No autenticado" });
  }

  // El token guarda el rol; verificamos que el rol sea 'admin'
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ 
      message: "Acceso denegado. Solo administradores." 
    });
  }

  next();
};

module.exports = esAdministrador;