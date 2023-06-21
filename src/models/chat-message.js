import mongoose from "mongoose";

const MESSAGE_TYPES = {
	TEXT: "text",
	MEDIA: "media",
};

const chatMessageSchema = mongoose.Schema(
	{
		chatRoomId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "ChatRoom",
			required: true,
		},
		type: {
			type: String,
			default: MESSAGE_TYPES.TEXT,
			enum: [MESSAGE_TYPES.TEXT, MESSAGE_TYPES.MEDIA],
		},
		message: {
			type: String,
			required: true,
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

chatMessageSchema.statics.sendMessageInChatRoom = async function ({
	chatRoomId,
	message,
	sender,
	type,
}) {
	const schema = this;
	const newMessage = await schema.create({
		chatRoomId,
		message,
		sender,
		type,
	});

	const chatMessage = await schema.aggregate([
		{
			$match: { _id: newMessage._id },
		},
		{
			$lookup: {
				from: "users",
				localField: "sender",
				foreignField: "_id",
				as: "sender",
			},
		},
		{
			$unwind: "$sender",
		},
		{
			$lookup: {
				from: "chatrooms",
				localField: "chatRoomId",
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
		{ $unwind: "$recipients.userProfile" },
		{
			$group: {
				_id: "$recipients._id",
				id: { $last: "$_id" },
				chatRoomId: { $last: "$recipients._id" },
				message: { $last: "$message" },
				type: { $last: "$type" },
				sender: { $last: "$sender" },
				recipients: { $addToSet: "$recipients.userProfile" },
				createdAt: { $last: "$createdAt" },
			},
		},
		{
			$project: {
				id: 1,
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

	return chatMessage[0];
};

const ChatMessage = new mongoose.model("ChatMessage", chatMessageSchema);
export default ChatMessage;
