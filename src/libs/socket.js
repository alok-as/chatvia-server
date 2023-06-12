const users = {};

export const onSocketConnection = (io, socket) => {
	socket.on("identity", (user) => {
		const isExisiting = users[socket.id];

		if (!isExisiting) {
			users[socket.id] = user;
		}

		io.emit("usersStatus", users);
	});

	socket.on("subscribe", (roomId, receiverId) => {
		socket.join(roomId);
		const otherSocket = getOtherSocketConnection(receiverId);

		if (otherSocket) {
			otherSocket.join(roomId);
		}
	});

	socket.on("disconnect", () => {
		delete users[socket.id];
		io.emit("usersStatus", users);
	});
};

const getOtherSocketConnection = (otherUserId) => {
	const userSocket = Object.entries(users).find(
		([_, userId]) => userId === otherUserId
	);

	if (userSocket) {
		const socketConn = global.io.sockets.sockets.get(userSocket[0]);
		if (socketConn.connected) {
			return socketConn;
		}
	}
};
