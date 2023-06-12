import ChatMessage from "../models/chat-message.js";
import ChatRoom from "../models/chat-room.js";

import { asyncHandler } from "../utils/index.js";

export const sendMessageInChatRoom = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { chatRoomId, message } = req.body;

	const chatMessage = new ChatMessage({ chatRoomId, message, sentBy: _id });
	await chatMessage.save();

	global.io.sockets.in(chatRoomId).emit("new message", { message });

	res.status(201).send({
		message: "Message sent successfully",
		data: chatMessage,
		success: true,
	});
});

export const getRecentChats = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const rooms = await ChatRoom.getChatRoomsByUserId(_id);
	const roomIds = rooms.map((room) => room._id);

	console.log("chatRoomIds", roomIds);

	const recentChats = await ChatMessage.aggregate([
		{ $match: { chatRoomId: { $in: roomIds } } },
		{
			$group: {
				_id: "$chatRoomId",
				chatRoomId: { $last: "$chatRoomId" },
				message: { $last: "$message" },
				type: { $last: "$type" },
				sentBy: { $last: "$sentBy" },
				createdAt: { $last: "$createdAt" },
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "sentBy",
				foreignField: "_id",
				as: "sentBy",
			},
		},
		{ $unwind: "$sentBy" },
		{
			$lookup: {
				from: "chatrooms",
				localField: "_id",
				foreignField: "_id",
				as: "roomInfo",
			},
		},
		{ $unwind: "$roomInfo" },
		{ $unwind: "$roomInfo.userIds" },
		{
			$lookup: {
				from: "users",
				localField: "roomInfo.userIds",
				foreignField: "_id",
				as: "roomInfo.userProfile",
			},
		},
		{
			$unwind: "$roomInfo",
		},
		{
			$group: {
				_id: "$roomInfo._id",
				chatRoomId: { $last: "$chatRoomId" },
				message: { $last: "$message" },
				type: { $last: "$type" },
				sentBy: { $last: "$sentBy" },
				roomInfo: { $addToSet: "$roomInfo.userProfile" },
				createdAt: { $last: "$createdAt" },
			},
		},
		{
			$project: {
				_id: 0,
				chatRoomId: 1,
				message: 1,
				type: 1,
				"sentBy._id": 1,
				"sentBy.email": 1,
				"sentBy.username": 1,
				"sentBy.imageUrl": 1,
				"roomInfo._id": 1,
				"roomInfo.username": 1,
				"roomInfo.email": 1,
				"roomInfo.imageUrl": 1,
				createdAt: 1,
			},
		},
	]);

	res.send({
		message: "Recent chats fetched successfully",
		data: recentChats,
		success: true,
	});
});

export const getConversationForChatRoom = asyncHandler(async (req, res) => {
	const { chatRoomId } = req.params;
	const conversation = await ChatMessage.find({ chatRoomId });

	res.send({
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
