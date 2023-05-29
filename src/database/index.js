import mongoose from "mongoose";
import config from "../config/index.js";

export const connectToDatabase = async () => {
	try {
		const { name, url } = config.database;
		const conn = await mongoose.connect(`${url}/${name}`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Database is connected to", conn.connection.host);
	} catch (error) {
		console.log("Error connecting to database", error);
		process.exit(1);
	}
};
