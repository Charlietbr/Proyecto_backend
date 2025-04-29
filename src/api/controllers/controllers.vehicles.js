const User = require("../models/user");
const Vehicle = require("../models/vehicle");
const Track = require("../models/track");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const deleteFromCloudinary = require("../../utils/deleteFromCloudinary");

const mongoose = require("mongoose");



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


//*=================== Exportar los controladores

module.exports = {

  createVehicle,
  getVehicles,
  getVehicleById,
  getVehiclesByUserId,
  updateVehicleById,
  deleteVehicleById,

};
