import ChatRoom from "../models/chat-room.js";
import { asyncHandler } from "../utils/index.js";

export const initiateChat = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { userIds } = req.body;

	console.log("_id", _id, userIds);

	const room = await ChatRoom.initiateChat([...userIds, _id], _id);
	res.status(201).send({
		message: "Chat initiaited successfully",
		data: room,
		success: true,
	});
});

export const deleteUsersChat = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	await ChatRoom.deleteMany({ initiator: _id });

	res.status(201).send({
		message: "Chats deleted successfully",
		data: null,
		success: true,
	});
});
