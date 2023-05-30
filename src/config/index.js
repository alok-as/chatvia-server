const config = {
	server: {
		port: process.env.PORT,
		environment: process.env.ENV,
	},
	security: {
		saltRounds: +process.env.SALT_ROUNDS,
		jwtSecret: process.env.JWT_SECRET,
		accessExpiry: process.env.ACCESS_TOKEN_EXPIRATION,
		refreshExpiry: process.env.REFRESH_TOKEN_EXPIRATION,
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
