require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const routes = require("./api/routes/routes");
const path = require("path");


//*=========================================


const app = express();


connectDB();


app.use(express.json());
app.use(cors());


app.use("/api", routes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});


