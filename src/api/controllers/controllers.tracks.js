const User = require("../models/user");
const Vehicle = require("../models/vehicle");
const Track = require("../models/track");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const deleteFromCloudinary = require("../../utils/deleteFromCloudinary");

const mongoose = require("mongoose");



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




//*=================== Exportar los controladores



module.exports = {

  createTrack,
  getTracks,
  getTrackById,
  getUserTracks,
  getAllTracks,
  updateTrackById,
  deleteTrack,

};
