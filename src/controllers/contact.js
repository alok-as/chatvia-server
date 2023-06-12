import Contact from "../models/contact.js";
import User from "../models/user.js";

import { asyncHandler } from "../utils/index.js";

export const createContact = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { email, name } = req.body;

	const isExistingContact = await Contact.checkIfExistingContact(_id, email);
	if (isExistingContact) {
		res.status(409);
		throw new Error(`${email} is already a contact`);
	}

	const user = await User.checkIfExistingUser(email);
	const contact = new Contact({
		email,
		name,
		user: _id,
		contactId: user?._id,
		isRegistered: user ? true : false,
	});
	await contact.save();

	res.send({
		data: null,
		message: "Contact created successfully",
		success: true,
	});
});

export const getChatContacts = asyncHandler(async (req, res) => {
	const { _id } = req.user;

	const contacts = await Contact.aggregate([
		{
			$match: {
				user: _id,
			},
		},
		{
			$group: {
				_id: "$isRegistered",
				contacts: { $push: "$$ROOT" },
			},
		},
		{
			$project: {
				_id: 0,
				isRegistered: "$_id",
				"contacts.name": 1,
				"contacts.email": 1,
				"contacts.contactId": 1,
			},
		},
	]);

	res.send({
		data: contacts,
		message: "Chat Contacts fetched successfully",
		success: true,
	});
});

export const getUserContacts = asyncHandler(async (req, res) => {
	const { _id } = req.user;

	const contacts = await Contact.aggregate([
		{
			$match: {
				user: _id,
			},
		},
		{
			$group: {
				_id: { $substr: ["$name", 0, 1] },
				contacts: { $push: "$$ROOT" },
			},
		},
		{
			$project: {
				_id: 0,
				initial: "$_id",
				"contacts.name": 1,
				"contacts.email": 1,
				"contacts.contactId": 1,
			},
		},
		{
			$sort: { initial: 1 },
		},
	]);

	res.send({
		data: contacts,
		message: "User Contacts fetched successfully",
		success: true,
	});
});

export const deleteContacts = asyncHandler(async (req, res) => {
	await Contact.deleteMany({});

	res.send({
		data: null,
		message: "Contacts deleted successfully",
		success: true,
	});
});
