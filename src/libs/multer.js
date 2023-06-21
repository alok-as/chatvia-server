import multer from "multer";
import storage from "./cloudinary.js";

const parser = multer({ storage });
export default parser;
