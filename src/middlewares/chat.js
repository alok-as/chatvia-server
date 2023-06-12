export const connectUser = (socket, next) => {
	const id = socket.handshake.auth.id;

	if (!id) {
		return next(new Error("Unauthenticated!!!"));
	}

	socket.user = id;
	next();
};
