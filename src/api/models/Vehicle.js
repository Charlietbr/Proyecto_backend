const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    brand: {type: String, required: true},
    model: {type: String, required: true},
    year: {type: Number, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"} // ref modelo User
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);
