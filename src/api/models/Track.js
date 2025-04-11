const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema(
  {
    routeName: {type: String, required: true},
    distance: {type: Number, required: true}, // en km
    time: {type: String, required: true}, // formato HH:mm:ss
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"}, // ref modelo User
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Track || mongoose.model("Track", trackSchema);
