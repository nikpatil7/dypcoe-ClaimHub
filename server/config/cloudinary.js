const cloudinary = require("cloudinary").v2; 
const config = require('./config');

exports.cloudinaryConnect = () => {
	try {
		cloudinary.config({
			//!    ########   Configuring the Cloudinary to Upload MEDIA ########
			cloud_name: config.CLOUDINARY_CLOUD_NAME,
			api_key: config.CLOUDINARY_API_KEY,
			api_secret: config.CLOUDINARY_API_SECRET,
			secure: true
		});
		console.log("Cloudinary connected successfully");
	} catch (error) {
		console.error("Cloudinary connection failed:", error);
        throw error;
	}
};