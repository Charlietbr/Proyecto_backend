const User = require("../models/user");
const Vehicle = require("../models/vehicle");
const Track = require("../models/track");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const deleteFromCloudinary = require("../../utils/deleteFromCloudinary");

const mongoose = require("mongoose");


//!=============================== Controllers de usuario

const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

   
    const newUser = new User({
      username,
      email,
      password,
      role,
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
const updateUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

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


//!=============================== Controllers de vehículo

const createVehicle = async (req, res, next) => {
  try {
    const { brand, model, year } = req.body;

    const newVehicle = await Vehicle.create({
      brand,
      model,
      year,
      user: req.user._id, // user de middleware authenticate
    });

    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { vehicles: newVehicle._id } }, // añadir sin duplicar
      { new: true }
    );

    res.status(201).json(newVehicle);
  } catch (error) {
    next(error);
  }
};
const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find().populate("user");
    return res.status(200).json(vehicles);
  } catch (error) {
    console.error("Error al obtener vehículos:", error);
    next(error);
  }
};
const getVehicleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findById(id).populate("user");

    if (!vehicle) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }

    return res.status(200).json(vehicle);
  } catch (error) {
    console.error("Error al obtener vehículo:", error);
    next(error);
  }
};
const getVehiclesByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const vehicles = await Vehicle.find({ user: userId }).populate("user");

    if (!vehicles.length) {
      return res.status(404).json({ message: "No se encontraron vehículos para este usuario" });
    }

    return res.status(200).json(vehicles);
  } catch (error) {
    console.error("Error al obtener vehículos del usuario:", error);
    next(error);
  }
};
const updateVehicleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedVehicle = await Vehicle.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedVehicle) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }

    return res.status(200).json(updatedVehicle);
  } catch (error) {
    console.error("Error al actualizar vehículo:", error);
    next(error);
  }
};
const deleteVehicleById = async (req, res, next)=>{
  try {
    const {id} = req.params;
    const deletedVehicle = await Vehicle.findByIdAndDelete(id);

    if (!deletedVehicle){
      return res.status(404).json( "Vehículo no encontrado");
    }

    return res.status(200).json("Vehículo eliminado");

  } catch (error) {
    console.log("Se ha producido un error al intentar eliminar el vehículo: ", error);
    next(error);
  }
};


//!=============================== Controllers de track

const createTrack = async (req, res, next) => {
  try {
    const { routeName, distance, time } = req.body;

    const newTrack = await Track.create({
      routeName,
      distance,
      time,
      user: req.user._id,
    });

    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { tracks: newTrack._id } },
      { new: true }
    );

    res.status(201).json(newTrack);
  } catch (error) {
    next(error);
  }
};
const getTracks = async (req, res, next) => {
  try {
    const tracks = await Track.find();
    return res.status(200).json(tracks);
  } catch (error) {
    console.error("No se han podido obtener las rutas. Error: ", error);
    next(error);
  }
};
const getTrackById = async (req, res, next) =>{
  try {
    const {id} = req.params;
    const track = await Track.findById(id).populate("user");

    if (!track) {
      return res.status(404).json({ message : "No se ha encontrado el track solicitado"});
    }

    return res.status(200).json(track);

  } catch (error) {
    console.error("No se ha encontrado el track solicitado. Error: ", error);
    next(error);
  }
};
const getUserTracks = async (req, res, next) => {
  try {
    const userTracks = await Track.find({ user: req.user._id });

    res.status(200).json(userTracks);
  } catch (error) {
    next(error);
  }
};
const getAllTracks = async (req, res, next)=> {
  try {
    const tracks = await Track.find().populate("user", "username email");
    res.status(200).json(tracks);
  } catch (error) {
    next(error);
  }
};
const updateTrackById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedTrack = await Track.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedTrack) {
      return res.status(404).json({ message: "Track no encontrado" });
    }

    return res.status(200).json(updatedTrack);
  } catch (error) {
    console.error("Error al actualizar track:", error);
    next(error);
  }
};
const deleteTrack = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedTrack = await Track.findByIdAndDelete(id);

    if (!deletedTrack) {
      return res.status(404).json({ message: "Track no encontrado" });
    }

    return res.status(200).json({ message: "Track eliminado correctamente" });

  } catch (error) {
    console.error("Error al eliminar track:", error);
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

  createVehicle,
  getVehicles,
  getVehicleById,
  getVehiclesByUserId,
  updateVehicleById,
  deleteVehicleById,

  createTrack,
  getTracks,
  getTrackById,
  getUserTracks,
  getAllTracks,
  updateTrackById,
  deleteTrack,

  loginUser,
};
