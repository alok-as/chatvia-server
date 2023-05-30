import { Router } from "express";
import {
	createUser,
	deleteUsers,
	getUsers,
	loginUser,
} from "../controllers/user.js";

import { login, user } from "../validations/user.js";
import { validate } from "../middlewares/app.js";

const router = Router();

router.post("/", validate(user), createUser);
router.post("/login", validate(login), loginUser);

router.get("/", getUsers);
router.delete("/", deleteUsers);

export default router;
