const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Denegado. Necesitas permisos de administrador." });
    }
  
    next(); 

  };


  module.exports = authorizeAdmin;