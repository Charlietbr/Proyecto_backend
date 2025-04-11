const express = require("express");
const {uploadImage, uploadToCloudinary} = require("../middlewares/uploadImage");
const { 
    createUser, 
    getUsers, 
    getUserById, 
    deleteUserById, 
    updateUserById,
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
    updateTrackById,
    deleteTrack,
    getAllTracks,

} = require("../controllers/controllers");

const { loginUser } = require("../controllers/controllers");
const authenticate = require("../middlewares/auth");
const authorizeAdmin = require("../middlewares/authorizeAdmin");


const router = express.Router();

// login

router.post("/login", loginUser);

// auth

router.get("/users", authenticate, getUsers);

// Rutas de usuario
router.post("/register", uploadImage, uploadToCloudinary, createUser);
router.get("/users", authenticate, authorizeAdmin, getUsers);
router.get("/users/:id", authenticate, getUserById);
router.put("/users/:id", authenticate, authorizeAdmin, updateUserById);
router.delete("/users/:id", authenticate, authorizeAdmin, deleteUserById);
router.put("/users/:id/role", authenticate, authorizeAdmin, updateUserRole);

// Rutas de vehículo
router.post("/vehicles", authenticate, createVehicle);
router.get("/vehicles", authenticate, getVehicles);
router.get("/vehicles/:id", authenticate, getVehicleById);
router.get("/vehicles/user/:userId", authenticate, getVehiclesByUserId);
router.put("/vehicles/:id", authenticate, updateVehicleById);
router.delete("/vehicles/:id", authenticate, deleteVehicleById);

//Rutas de track
router.post("/tracks", authenticate, createTrack);
router.get("/tracks", authenticate, getTracks);
router.get("/tracks/:id", authenticate, getTrackById);
router.get("/my-tracks", authenticate, getUserTracks);
router.get("/tracks", authenticate, authorizeAdmin, getAllTracks);
router.put("/tracks/:id", authenticate, updateTrackById);
router.delete("/tracks/:id", authenticate, deleteTrack);


module.exports = router;
