import path from "path";
import { fileURLToPath } from "url";

export const asyncHandler = (fn) => (req, res, next) => {
	return Promise.resolve(fn(req, res, next)).catch(next);
};

export const getDirName = (url) => {
	const __filename = fileURLToPath(url);
	const __dirname = path.dirname(__filename);
	return __dirname;
};
