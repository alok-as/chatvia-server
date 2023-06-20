import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { z } from "zod";

import Contact from "./contact.js";
import config from "../config/index.js";

const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			validate: {
				validator: () => z.string().email(),
				message: ({ value }) => `${value} is not a valid email address`,
			},
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: false,
			default: "Hey Guys, I am on Chatvia.",
		},
		imageUrl: {
			type: String,
			required: false,
			default:
				"http://chatvia-laravel.themesbrand.website/assets/images/users/avatar-7.jpg",
		},
	},
	{
		timestamps: true,
	}
);

userSchema.statics.checkIfExistingEmail = async function (email) {
	const schema = this;
	const user = await schema.findOne({ email });
	return user ? true : false;
};

userSchema.statics.checkIfExistingUsername = async function (username) {
	const schema = this;
	const user = await schema.findOne({ username });
	return user ? true : false;
};

userSchema.statics.checkIfExistingUser = async function (usernameOrEmail) {
	const schema = this;
	const user = await schema.findOne({
		$or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
	});

	return user;
};

userSchema.methods.verifyPassword = async function (password) {
	const user = this;
	return bcrypt.compare(password, user.password);
};

userSchema.pre("save", async function (next) {
	const user = this;

	if (user.isModified("password")) {
		user.password = await bcrypt.hash(
			user.password,
			config.security.saltRounds
		);
	}

	next();
});

userSchema.post("save", async function (user) {
	console.log("user._id", user._id);
	await Contact.updateMany(
		{ email: user.email },
		{ $set: { isRegistered: true, contactId: user._id } }
	);
});

const User = mongoose.model("User", userSchema);
export default User;
