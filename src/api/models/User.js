const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ["user", "admin"], default: "user"},
    /*image: {type: String}, // URL img cloudinary*/
    image: {url: {type:String}, public_id:{type:String}},
    vehicles: [ {type: mongoose.Schema.Types.ObjectId, ref: "Vehicle"} ], // ref a modelo Vehicle
    tracks: [ {type: mongoose.Schema.Types.ObjectId, ref: "Track"} ], // ref a modelo Track
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
