import { Router } from "express";
import {
	sendMessageInChatRoom,
	getConversationForChatRoom,
	deleteConversationForChatRoom,
	getRecentChats,
} from "../controllers/chat-message.js";

import parser from "../libs/multer.js";

import { authenticated } from "../middlewares/auth.js";
import { validate } from "../middlewares/app.js";
import { chatMessage } from "../validations/chat-message.js";

const router = Router();

router.post(
	"/",
	authenticated,
	parser.single("message"),
	validate(chatMessage),
	sendMessageInChatRoom
);

router.get("/", authenticated, getRecentChats);
router.get("/:chatRoomId", authenticated, getConversationForChatRoom);

router.delete("/:chatRoomId", authenticated, deleteConversationForChatRoom);

export default router;
