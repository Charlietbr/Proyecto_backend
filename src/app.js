require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const usersRouter = require("./api/routes/routes.users");
const vehiclesRouter = require("./api/routes/routes.vehicles");
const tracksRouter = require("./api/routes/routes.tracks");
const path = require("path");


//*=========================================


const app = express();


connectDB();


app.use(express.json());
app.use(cors());


app.use("/api", usersRouter);
app.use("/api", vehiclesRouter);
app.use("/api", tracksRouter);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});


