import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import config from "../config/index.js";

cloudinary.config({
	cloud_name: config.cloudinary.cloud,
	api_key: config.cloudinary.key,
	api_secret: config.cloudinary.secret,
});

const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "chatvia",
		format: () => "webp",
		public_id: (req, file) => {
			const { _id } = req.user;
			const imageId = new mongoose.Types.ObjectId();
			const fileName = `${_id}/${imageId}-${file.originalname}`;
			return fileName;
		},
	},
});

export const getCloudinaryImages = async (userId) => {
	const { resources } = await cloudinary.search
		.expression(`folder: chatvia/${userId}`)
		.execute();

	const images = resources.map((resource) => ({
		id: resource.public_id,
		url: resource.url,
		folder: resource.folder,
		filename: `${resource.filename.split("-")[1]}.${resource.format}`,
		size: (resource.bytes * 0.001).toFixed(1),
	}));

	return images;
};

export default storage;
