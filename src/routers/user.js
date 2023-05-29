import { Router } from "express";
import { createUser, getUsers } from "../controllers/user.js";

import { user } from "../validations/user.js";
import { validate } from "../middlewares/app.js";

const router = Router();

router.post("/", validate(user), createUser);
router.get("/", getUsers);

export default router;
