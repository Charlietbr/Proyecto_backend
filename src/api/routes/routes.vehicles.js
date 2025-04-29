const express = require("express");
const { 

    createVehicle,
    getVehicles,
    getVehicleById,
    getVehiclesByUserId,
    updateVehicleById,
    deleteVehicleById,


} = require("../controllers/controllers.vehicles");

const { loginUser } = require("../controllers/controllers.users");
const authenticate = require("../middlewares/auth");
const authorizeAdmin = require("../middlewares/authorizeAdmin");


const vehiclesRouter = express.Router();

// login

vehiclesRouter.post("/login", loginUser);


// Rutas de vehículo
vehiclesRouter.post("/vehicles", authenticate, createVehicle);
vehiclesRouter.get("/vehicles", authenticate, getVehicles);
vehiclesRouter.get("/vehicles/:id", authenticate, getVehicleById);
vehiclesRouter.get("/vehicles/user/:userId", authenticate, getVehiclesByUserId);
vehiclesRouter.put("/vehicles/:id", authenticate, updateVehicleById);
vehiclesRouter.delete("/vehicles/:id", authenticate, deleteVehicleById);


module.exports = vehiclesRouter;
