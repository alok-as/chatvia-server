const onlineUsers = {};

export const onSocketConnection = (io, socket) => {
	socket.on("identity", (user) => {
		const isExisiting = onlineUsers[socket.id];

		if (!isExisiting) {
			onlineUsers[socket.id] = user;
		}

		io.emit("users status", onlineUsers);
	});

	socket.on("subscribe", (roomId, receiverId) => {
		socket.join(roomId);

		if (receiverId) {
			const otherSocket = getOtherSocketConnection(receiverId);

			if (otherSocket) {
				otherSocket.join(roomId);
			}
		}
	});

	socket.on("typing", ({ chatRoomId, senderId }) => {
		io.sockets.in(chatRoomId).emit("typing", senderId);
	});

	socket.on("done typing", ({ chatRoomId, senderId }) => {
		io.sockets.in(chatRoomId).emit("done typing", senderId);
	});

	socket.on("unsubscribe", (roomId) => {
		socket.leave(roomId);
	});

	socket.on("get user status", () => {
		io.emit("users status", onlineUsers);
	});

	socket.on("disconnect", () => {
		delete onlineUsers[socket.id];
		io.emit("users status", onlineUsers);
	});
};

const getOtherSocketConnection = (otherUserId) => {
	const userSocket = Object.entries(onlineUsers).find(
		([_, userId]) => userId === otherUserId
	);

	if (userSocket) {
		const socketConn = global.io.sockets.sockets.get(userSocket[0]);
		if (socketConn.connected) {
			return socketConn;
		}
	}
};
