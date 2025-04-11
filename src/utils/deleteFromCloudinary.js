const cloudinary = require("../config/cloudinaryConfig");

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error al eliminar imagen de Cloudinary:", error);
    throw error;
  }
};

module.exports = deleteFromCloudinary;