import { Router } from "express";
import {
	createUser,
	deleteUsers,
	getUserProfile,
	loginUser,
	getUsers,
	getUserAttachments,
} from "../controllers/user.js";

import { authenticated } from "../middlewares/auth.js";
import { login, user } from "../validations/user.js";
import { validate } from "../middlewares/app.js";

const router = Router();

router.post("/", validate(user), createUser);
router.post("/login", validate(login), loginUser);

router.get("/", getUsers);
router.get("/attachments", authenticated, getUserAttachments);
router.get("/:id", authenticated, getUserProfile);
router.delete("/", authenticated, deleteUsers);

export default router;
