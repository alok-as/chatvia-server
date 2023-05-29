import User from "../models/user.js";
import { asyncHandler } from "../utils/index.js";

export const createUser = asyncHandler(async (req, res) => {
	const { userName, email } = req.body;
	const isExisting = await User.checkIfExistingUser(userName, email);

	if (isExisting) {
		return res.send({
			data: null,
			message: "User already exists!",
			success: false,
		});
	}

	const user = new User(req.body);
	await user.save();

	res.send({
		data: user,
		message: "User created successfully",
		success: true,
	});
});

export const getUsers = asyncHandler(async (req, res) => {
	const users = await User.find({});

	res.send({
		data: users,
		message: "User fetched successfully",
		success: true,
	});
});
