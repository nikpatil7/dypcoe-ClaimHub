const fs = require('fs'); 
const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  if (!file || !file.tempFilePath) {
    throw new Error('No file or invalid file provided');
  }

  try {
    const options = { 
      folder: folder || "ClaimHub-dypcoe",
      resource_type: "auto", // Automatically detect image/video
      crop: "limit",
      width: 1000
    };
    
    if (height) options.height = height;
    if (quality) options.quality = quality;
    
    console.log("Uploading file to Cloudinary:", {
      originalname: file.name,
      mimetype: file.mimetype,
      size: file.size,
      folder: options.folder
    });

    // Upload using the temp file path
    const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, options);

    // Clean up temp file
    fs.unlinkSync(file.tempFilePath);

    console.log("Cloudinary upload successful:", {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
      format: uploadResult.format
    });

    return uploadResult;
  } catch (error) {
    // Clean up temp file on error
    if (file.tempFilePath && fs.existsSync(file.tempFilePath)) {
      fs.unlinkSync(file.tempFilePath);
    }
    console.error("Cloudinary upload error:", error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

// Optional: delete image from Cloudinary
exports.deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary delete result:", result);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
};
