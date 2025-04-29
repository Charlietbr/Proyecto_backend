const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const deleteFromCloudinary = require("../../utils/deleteFromCloudinary");

const mongoose = require("mongoose");


//!=============================== Controllers de usuario.


const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

   // Actualizado. No tomar role del body para crearlo siempre como user.
    const newUser = new User({
      username,
      email,
      password,
      role: "user",
      image: req.body.image,  // URL imagen
    });

    await newUser.save();
    return res.status(201).json({ message: "Usuario creado correctamente", user: newUser });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return res.status(500).json({ message: "Error al crear usuario", error });
  }
};
const getUsers = async (req, res, next) => {
  try {

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden ver los usuarios." });
    }

    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    next(error);
  }
};
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

//check id válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID de usuario no válido." });
  }


    const user = await User.findById(id)
      .populate("vehicles")
      .populate("tracks");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error);
    next(error);
  }
};

//?==============CHECK duplicados
const updateUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    
        // 1 Usuario
        const user = await User.findById(id);
        if (!user) {
          return res.status(404).json({ message: "Usuario no encontrado" });
        }
    
        const updates = { ...req.body };
    
        // 2 Dupli vehicles
        if (req.body.vehicles) {
          const prevVehicles = user.vehicles.map(id => id.toString());
          const newVehicles = req.body.vehicles.map(id => id.toString());
          const allVehicles = [...new Set([...prevVehicles, ...newVehicles])];
          updates.vehicles = allVehicles;
        }
    
        // 3 Dupli tracks
        if (req.body.tracks) {
          const prevTracks = user.tracks.map(id => id.toString());
          const newTracks = req.body.tracks.map(id => id.toString());
          const allTracks = [...new Set([...prevTracks, ...newTracks])];
          updates.tracks = allTracks;
        }
    
        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
    


    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // check user propietario o admin
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "No tienes permisos para eliminar esta cuenta" });
    }

    // buscar
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // elimina img si existe
    if (user.image && user.image.public_id) {
      await deleteFromCloudinary(user.image.public_id);
    }

    // elimina user
    await User.findByIdAndDelete(id);

    return res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    next(error);
  }
};
const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "El rol debe ser 'user' o 'admin'" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error al actualizar rol de usuario:", error);
    next(error);
  }
};




//!=============================== autenticación

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token, user });
  } catch (error) {
    next(error);
  }
};




//*=================== Exportar los controladores

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  updateUserRole,

  loginUser,
};
