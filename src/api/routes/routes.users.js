const express = require("express");
const {uploadImage, uploadToCloudinary} = require("../middlewares/uploadImage");
const { 
    createUser, 
    getUsers, 
    getUserById, 
    deleteUserById, 
    updateUserById,
    updateUserRole,


} = require("../controllers/controllers.users");

const { loginUser } = require("../controllers/controllers.users");
const authenticate = require("../middlewares/auth");
const authorizeAdmin = require("../middlewares/authorizeAdmin");


const usersRouter = express.Router();

// login

usersRouter.post("/login", loginUser);

// auth

usersRouter.get("/users", authenticate, getUsers);

// Rutas de usuario
usersRouter.post("/register", uploadImage, uploadToCloudinary, createUser);
usersRouter.get("/users", authenticate, authorizeAdmin, getUsers);
usersRouter.get("/users/:id", authenticate, getUserById);
usersRouter.put("/users/:id", authenticate, authorizeAdmin, updateUserById);
usersRouter.delete("/users/:id", authenticate, authorizeAdmin, deleteUserById);
usersRouter.put("/users/:id/role", authenticate, authorizeAdmin, updateUserRole);


module.exports = usersRouter;
