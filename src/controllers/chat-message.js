import ChatMessage from "../models/chat-message.js";
import { asyncHandler } from "../utils/index.js";

export const sendMessageInChatRoom = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { chatRoomId, message } = req.body;

	const chatMessage = new ChatMessage({ chatRoomId, message, sentBy: _id });
	await chatMessage.save();

	res.status(201).send({
		message: "Message sent successfully",
		data: chatMessage,
		success: true,
	});
});

export const getConversationForChatRoom = asyncHandler(async (req, res) => {
	const { chatRoomId } = req.params;
	const conversation = await ChatMessage.find({ chatRoomId });

	res.status(201).send({
		message: "Conversation fetched successfully",
		data: conversation,
		success: true,
	});
});

export const deleteConversationForChatRoom = asyncHandler(async (req, res) => {
	const { chatRoomId } = req.params;
	await ChatMessage.deleteMany({ chatRoomId });

	res.status(201).send({
		message: "Conversation cleared successfully",
		data: null,
		success: true,
	});
});
