const express = require("express");
const { 
    
    createTrack,
    getTracks,
    getTrackById,
    getUserTracks,
    updateTrackById,
    deleteTrack,
    getAllTracks,

} = require("../controllers/controllers.tracks");

const { loginUser } = require("../controllers/controllers.users");
const authenticate = require("../middlewares/auth");
const authorizeAdmin = require("../middlewares/authorizeAdmin");


const tracksRouter = express.Router();

// login

tracksRouter.post("/login", loginUser);


//Rutas de track
tracksRouter.post("/tracks", authenticate, createTrack);
tracksRouter.get("/tracks", authenticate, getTracks);
tracksRouter.get("/tracks/:id", authenticate, getTrackById);
tracksRouter.get("/my-tracks", authenticate, getUserTracks);
tracksRouter.get("/tracks", authenticate, authorizeAdmin, getAllTracks);
tracksRouter.put("/tracks/:id", authenticate, updateTrackById);
tracksRouter.delete("/tracks/:id", authenticate, deleteTrack);


module.exports = tracksRouter;
