require('dotenv').config();


const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../api/models/User");
const Vehicle = require("../api/models/Vehicle");
const Track = require("../api/models/Track");

const connectDB = require("../config/db");

connectDB();

const seedDB = async () => {
  try {
    // borrar base de datos antes de añadir los datos del seed
    await User.deleteMany();
    await Vehicle.deleteMany();
    await Track.deleteMany();

    // Creación de 5 usuarios
    const usersData = [
      { username: "Antoñico", email: "antonyico@mail.com", password: "password123" },
      { username: "Peligro", email: "breakdancer@mail.com", password: "password123" },
      { username: "Meri", email: "meri@mail.com", password: "password123" },
      { username: "Littlefield", email: "littlefield@mail.com", password: "password123" },
      { username: "Totti", email: "totti@mail.com", password: "password123" },
      { username: "Roberto", email: "rober@mail.com", password: "password123" },
      { username: "Lucía", email: "luchi@mail.com", password: "password123" },
      { username: "Dani", email: "dani@mail.com", password: "password123" },
      { username: "Jesucristo", email: "jesuscrist@thepower.com", password: "password123" },
      { username: "Venta Marcelino", email: "ventamarcelino@mail.com", password: "password123" },
    ];

    // Encriptar contraseñas y crear usuarios
    const users = await Promise.all(
      usersData.map(async (userData) => {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await User.create({
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          role: "user", // rol de usuario por defecto
        });
        return user;
      })
    );

    // Crear vehículos y tracks para cada usuario
    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      // Crear vehículos
      const vehicles = [
        { brand: "Toyota", model: "Corolla", year: 2020, user: user._id },
        { brand: "Honda", model: "Civic", year: 2019, user: user._id },
        { brand: "Volkswagen", model: "California T4", year: 2002, user: user._id },
        { brand: "Harley Davidson", model: "Iron 883", year: 2020, user: user._id },
        { brand: "Yamaha", model: "MT-07", year: 2019, user: user._id },
        { brand: "Renault", model: "Twingo", year: 1997, user: user._id },
        { brand: "Ktm", model: "390 Adventure", year: 2023, user: user._id },
        { brand: "Royal Enfield", model: "Himalayan 450", year: 2024, user: user._id },
        { brand: "Suzuki", model: "GS500", year: 2006, user: user._id },
        { brand: "Derbi", model: "Variant 50", year: 1995, user: user._id },
      ];

      // Crear vehículos
      const createdVehicles = await Vehicle.create(vehicles);

      // Añadir vehículos al usuario
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { vehicles: { $each: createdVehicles.map(v => v._id) } },
      });

      // Crear tracks
      const tracks = [
        { routeName: "Galapagar por la sombra", distance: 15, time: "00:30:00", user: user._id },
        { routeName: "Escorial esquivando quemaos", distance: 20, time: "00:35:00", user: user._id },
        { routeName: "Pincho y callos en Cercedilla", distance: 25, time: "00:40:00", user: user._id },
        { routeName: "Puerto de Navacerrada - Rascafría", distance: 10, time: "00:20:00", user: user._id },
        { routeName: "Becerril - Puerto de Canencia - Manzanares", distance: 30, time: "00:45:00", user: user._id },
        { routeName: "Al taller", distance: 1, time: "00:30:00", user: user._id },
        { routeName: "Aperitivo en el Varillas", distance: 20, time: "00:35:00", user: user._id },
        { routeName: "Atazar un martes", distance: 25, time: "00:40:00", user: user._id },
        { routeName: "Náutico - Villalba", distance: 10, time: "00:20:00", user: user._id },
        { routeName: "Me vuelvo andando", distance: 30, time: "00:45:00", user: user._id },
      ];

      // Crear tracks
      const createdTracks = await Track.create(tracks);

      // Añadir tracks al usuario
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { tracks: { $each: createdTracks.map(t => t._id) } },
      });
    }

    console.log("Base de datos semillada con éxito!");
  } catch (error) {
    console.error("Error al semillar la base de datos", error);
  } finally {
    mongoose.disconnect();
  }
};

seedDB();
