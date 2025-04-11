const cloudinary = require("../../config/cloudinaryConfig");
const multer = require("multer");
const streamifier = require("streamifier");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadImage = upload.single("image");

const uploadToCloudinary = (req, res, next) => {
  if (req.file) {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "users" },
      (error, result) => {
        if (error) {
          console.error("Error Cloudinary:", error);
          return res.status(500).json({ message: "Error al subir la imagen", error });
        }
        req.body.image = {
          url: result.secure_url,
          public_id: result.public_id
        };
        next();
      }
    );


    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } else {
    next();
  }
};

module.exports = { uploadImage, uploadToCloudinary };
