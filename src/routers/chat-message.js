import { Router } from "express";
import {
	sendMessageInChatRoom,
	getConversationForChatRoom,
	deleteConversationForChatRoom,
} from "../controllers/chat-message.js";

import { authenticated } from "../middlewares/auth.js";
import { validate } from "../middlewares/app.js";
import { chatMessage } from "../validations/chat-message.js";

const router = Router();

router.post("/", authenticated, validate(chatMessage), sendMessageInChatRoom);
router.get("/:chatRoomId", authenticated, getConversationForChatRoom);
router.delete("/:chatRoomId", authenticated, deleteConversationForChatRoom);

export default router;
