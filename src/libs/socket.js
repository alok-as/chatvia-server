class WebSocket {
	constructor() {
		this.users = [];
	}
	connection(client) {
		client.on("disconnect", () => {
			this.users = this.users.filter(
				(user) => user.socketId !== client.id
			);
		});
	}
}

const webSocket = new WebSocket();
export default webSocket;
