import { Router } from "express";
import {
	deleteUsersChat,
	initiateChat,
	getUsersChatRooms,
} from "../controllers/chat-room.js";

import { authenticated } from "../middlewares/auth.js";
import { validate } from "../middlewares/app.js";
import { chatRoom } from "../validations/chat-room.js";

const router = Router();

router.post("/", authenticated, validate(chatRoom), initiateChat);
router.delete("/", authenticated, deleteUsersChat);
router.get("/", authenticated, getUsersChatRooms);

export default router;
