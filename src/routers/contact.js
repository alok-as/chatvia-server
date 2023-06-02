import { Router } from "express";
import {
	createContact,
	getUserContacts,
	getUserContactsTest,
	deleteContacts,
} from "../controllers/contact.js";

import { authenticated } from "../middlewares/auth.js";
import { validate } from "../middlewares/app.js";
import { contact } from "../validations/contact.js";

const router = Router();

router.post("/", authenticated, validate(contact), createContact);
router.get("/", authenticated, getUserContacts);

// Testing
router.get("/user", getUserContactsTest);

router.delete("/", deleteContacts);

export default router;
