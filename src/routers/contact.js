import { Router } from "express";
import {
	createContact,
	getUserContacts,
	deleteContacts,
} from "../controllers/contact.js";

import { authenticated } from "../middlewares/auth.js";
import { validate } from "../middlewares/app.js";
import { contact } from "../validations/contact.js";

const router = Router();

router.post("/", authenticated, validate(contact), createContact);
router.get("/", authenticated, getUserContacts);
router.delete("/", deleteContacts);

export default router;
