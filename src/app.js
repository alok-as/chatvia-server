import http from "http";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";

import config from "./config/index.js";
import { connectToDatabase } from "./database/index.js";
import { errorHandler, notFound } from "./middlewares/app.js";
import { connectUser } from "./middlewares/chat.js";
import { generateAPIRoutes } from "./routers/index.js";

const initializeServer = async () => {
	try {
		const app = express();
		const port = config.server.port;

		const server = http.createServer(app);
		const io = new Server(server, {
			cors: {
				origin: config.client.origin,
			},
		});
		io.use(connectUser);

		app.use(express.json());
		app.use(
			cors({
				origin: config.client.origin,
			})
		);
		app.use(cookieParser());

		await connectToDatabase();
		const apiRoutes = await generateAPIRoutes();

		app.use("/api", apiRoutes);
		app.use(notFound);
		app.use(errorHandler);

		server.listen(port, () => {
			console.log(`Server is up and running on port ${port}`);
		});
	} catch (error) {
		console.log("Error setting up server", error);
		process.exit(1);
	}
};

initializeServer();
