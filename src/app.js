import express from "express";
import cors from "cors";

import config from "./config/index.js";

const app = express();
const port = config.server.port || 3001;

app.use(
	cors({
		origin: config.client.origin,
	})
);

app.listen(port, () => {
	console.log(`Server is up and running on port ${port}`);
});
