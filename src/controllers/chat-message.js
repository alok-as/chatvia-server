import mongoose from "mongoose";

import ChatMessage from "../models/chat-message.js";
import ChatRoom from "../models/chat-room.js";

import { asyncHandler } from "../utils/index.js";

export const sendMessageInChatRoom = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { chatRoomId, message } = req.body;

	const chatMessage = await ChatMessage.sendMessageInChatRoom({
		chatRoomId,
		message,
		sender: _id,
	});

	global.io.sockets.in(chatRoomId).emit("new message", chatMessage);

	res.status(201).send({
		message: "Message sent successfully",
		data: null,
		success: true,
	});
});

export const getRecentChats = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const rooms = await ChatRoom.getChatRoomsByUserId(_id);
	const roomIds = rooms.map((room) => room._id);

	const recentChats = await ChatMessage.aggregate([
		{ $match: { chatRoomId: { $in: roomIds } } },
		{
			$group: {
				_id: "$chatRoomId",
				chatRoomId: { $last: "$chatRoomId" },
				message: { $last: "$message" },
				type: { $last: "$type" },
				sender: { $last: "$sender" },
				createdAt: { $last: "$createdAt" },
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "sender",
				foreignField: "_id",
				as: "sender",
			},
		},
		{ $unwind: "$sender" },
		{
			$lookup: {
				from: "chatrooms",
				localField: "_id",
				foreignField: "_id",
				as: "recipients",
			},
		},
		{ $unwind: "$recipients" },
		{ $unwind: "$recipients.userIds" },
		{
			$lookup: {
				from: "users",
				localField: "recipients.userIds",
				foreignField: "_id",
				as: "recipients.userProfile",
			},
		},
		{
			$unwind: "$recipients",
		},
		{
			$group: {
				_id: "$recipients._id",
				chatRoomId: { $last: "$chatRoomId" },
				message: { $last: "$message" },
				type: { $last: "$type" },
				sender: { $last: "$sender" },
				recipients: { $addToSet: "$recipients.userProfile" },
				createdAt: { $last: "$createdAt" },
			},
		},
		{
			$project: {
				_id: 0,
				chatRoomId: 1,
				message: 1,
				type: 1,
				"sender._id": 1,
				"sender.email": 1,
				"sender.username": 1,
				"sender.imageUrl": 1,
				"recipients._id": 1,
				"recipients.username": 1,
				"recipients.email": 1,
				"recipients.imageUrl": 1,
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

	const conversation = await ChatMessage.aggregate([
		{ $match: { chatRoomId: new mongoose.Types.ObjectId(chatRoomId) } },
		{
			$lookup: {
				from: "users",
				localField: "sender",
				foreignField: "_id",
				as: "sender",
			},
		},
		{ $unwind: "$sender" },
		{
			$lookup: {
				from: "chatrooms",
				localField: "chatRoomId",
				foreignField: "_id",
				as: "recipients",
			},
		},
		{ $unwind: "$recipients" },
		{
			$lookup: {
				from: "users",
				localField: "recipients.userIds",
				foreignField: "_id",
				as: "recipients",
			},
		},
		{
			$project: {
				id: "$_id",
				_id: 0,
				chatRoomId: 1,
				message: 1,
				type: 1,
				"sender._id": 1,
				"sender.email": 1,
				"sender.username": 1,
				"sender.imageUrl": 1,
				"recipients._id": 1,
				"recipients.email": 1,
				"recipients.username": 1,
				"recipients.imageUrl": 1,
				createdAt: 1,
			},
		},
	]);

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
