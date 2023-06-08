import mongoose from "mongoose";

const MESSAGE_TYPES = {
	TEXT: "text",
};

const recipientsSchema = new mongoose.Schema(
	{
		_id: false,
		readBy: String,
		readAt: {
			type: Date,
			default: Date.now(),
		},
	},
	{
		timestamps: false,
	}
);

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
		},
		message: {
			type: String,
			required: true,
		},
		sentBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		recipientsSchema: [recipientsSchema],
	},
	{
		timestamps: true,
	}
);

const ChatMessage = new mongoose.model("ChatMessage", chatMessageSchema);
export default ChatMessage;
