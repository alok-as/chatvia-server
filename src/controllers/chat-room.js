import ChatRoom from "../models/chat-room.js";
import { asyncHandler } from "../utils/index.js";

export const initiateChat = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { userIds } = req.body;

	const room = await ChatRoom.initiateChat([...userIds, _id], _id);
	res.status(201).send({
		message: "Chat initiaited successfully",
		data: room,
		success: true,
	});
});

export const getUsersChatRooms = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const chatRooms = await ChatRoom.find({ userIds: { $in: _id } });

	res.status(201).send({
		message: "Chats rooms fetched successfully",
		data: chatRooms,
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
