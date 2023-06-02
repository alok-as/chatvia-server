import User from "../models/user.js";
import { asyncHandler, generateAuthTokens } from "../utils/index.js";

export const createUser = asyncHandler(async (req, res) => {
	const { username, email } = req.body;

	const [isExistingEmail, isExistingUsername] = await Promise.all([
		User.checkIfExistingEmail(email),
		User.checkIfExistingUsername(username),
	]);

	if (isExistingEmail) {
		res.status(409);
		throw new Error(`${email} already in use!`);
	}

	if (isExistingUsername) {
		res.status(409);
		throw new Error(`${username} already in use!`);
	}

	const user = new User(req.body);
	await user.save();

	const [accessToken, refreshToken] = generateAuthTokens({
		id: user._id,
		name: user.username,
	});

	res.send({
		message: "User created successfully",
		data: {
			accessToken,
			refreshToken,
		},
		success: true,
	});
});

export const loginUser = asyncHandler(async (req, res) => {
	const { usernameOrEmail, password } = req.body;
	const user = await User.checkIfExistingUser(usernameOrEmail);

	if (!user) {
		res.status(404);
		throw new Error(
			`User with username or email ${usernameOrEmail} doesn't exits`
		);
	}

	const isMatch = await user.verifyPassword(password);
	if (!isMatch) {
		res.status(400);
		throw new Error("Incorrect Password!");
	}

	const [accessToken, refreshToken] = await generateAuthTokens({
		id: user._id,
		name: user.username,
	});

	res.send({
		message: "User successfully logged in",
		success: true,
		data: {
			accessToken,
			refreshToken,
		},
	});
});

export const getUsers = asyncHandler(async (_, res) => {
	const users = await User.find({});

	res.send({
		data: users,
		message: "Users fetched successfully",
		success: true,
	});
});

export const deleteUsers = asyncHandler(async (_, res) => {
	await User.deleteMany({});

	res.send({
		data: [],
		message: "Users deleted successfully",
		success: true,
	});
});
