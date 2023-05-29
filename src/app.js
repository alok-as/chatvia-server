import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";

import config from "./config/index.js";
import { errorHandler, notFound } from "./middlewares/app.js";
import { connectToDatabase } from "./database/index.js";
import { generateAPIRoutes } from "./routers/index.js";

const initializeServer = async () => {
	try {
		const app = express();
		const port = config.server.port || 3001;

		app.use(express.json());
		app.use(
			cors({
				origin: config.client.origin,
				credentials: true,
			})
		);
		app.use(cookieParser());

		await connectToDatabase();
		const apiRoutes = await generateAPIRoutes();

		app.use("/api", apiRoutes);
		app.use(notFound);
		app.use(errorHandler);

		app.listen(port, () => {
			console.log(`Server is up and running on port ${port}`);
		});
	} catch (error) {
		console.log("Error setting up server", error);
		process.exit(1);
	}
};

initializeServer();
