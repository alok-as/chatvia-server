import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema(
	{
		userIds: {
			type: [mongoose.Schema.Types.ObjectId],
			required: true,
		},
		initiator: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

chatRoomSchema.statics.initiateChat = async function (userIds, initiator) {
	const schema = this;
	const existingRoom = await schema.findOne({
		userIds: {
			$size: userIds.length,
			$all: [...userIds],
		},
	});

	if (existingRoom) {
		return {
			roomId: existingRoom._id,
		};
	}

	const room = await schema.create({ userIds, initiator });
	return {
		roomId: room._id,
	};
};

chatRoomSchema.statics.getChatRoomsByUserId = async function (userId) {
	const schema = this;
	const rooms = await schema.find({ userIds: { $all: [userId] } });
	return rooms;
};

const ChatRoom = new mongoose.model("ChatRoom", chatRoomSchema);
export default ChatRoom;
