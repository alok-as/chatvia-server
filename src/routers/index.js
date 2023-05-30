import { readdirSync } from "fs";

import { Router } from "express";
import { getDirName } from "../utils/index.js";

export const generateAPIRoutes = async () => {
	const router = Router();
	const __dirname = getDirName(import.meta.url);
	const files = readdirSync(__dirname);

	for (let file of files) {
		if (!file.includes("index")) {
			const routePrefix = file.replace(".js", "");
			const routes = await import(`./${file}`);
			router.use(`/${routePrefix}`, routes.default);
		}
	}

	return router;
};
