
const jwt = require("jsonwebtoken");
const User = require("../models/user");



const authenticate = async (req, res, next) => {
    // Obtener el token del encabezado Authorization
    const token = req.header("Authorization")?.replace("Bearer ", "");
  
    if (!token) {
      return res.status(401).json({ message: "Acceso no autorizado. No se proporcionó token." });
    }
  
    try {
      // verificar y decodificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decodificado: ", decoded);
      
  
      // buscar usuario usando el id del token decodificado
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado." });
      }
  
      // guardar la información del usuario en la solicitud req.user para usarla en las rutas
      req.user = user;
      next();
    } catch (error) {
      console.error("Error de autenticación:", error);
      return res.status(401).json({ message: "Token inválido o expirado." });
    }
  };
  
  module.exports = authenticate;



/* //old
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; //! <<<<< bearer token

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

module.exports = auth;
*/