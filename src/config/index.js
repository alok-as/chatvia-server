const config = {
	server: {
		port: process.env.PORT,
	},
	security: {
		saltRounds: process.env.SALT_ROUNDS,
	},
	client: {
		origin: process.env.ORIGIN,
	},
	database: {
		name: process.env.DATABASE_NAME,
		url: process.env.DATABASE_URL,
	},
};

export default config;
