export const connectUser = (socket, next) => {
	const username = socket.handshake.auth.username;

	if (!username) {
		return next(new Error("Unauthenticated!!!"));
	}

	next();
};
