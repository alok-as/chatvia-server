import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import { z } from "zod";

import config from "../config/index.js";

const userSchema = mongoose.Schema(
	{
		userName: {
			type: String,
			required: true,
			trim: true,
		},
		password: {
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
		description: {
			type: String,
			required: false,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.statics.checkIfExistingUser = async function (userName, email) {
	const schema = this;

	const user = await schema.findOne({
		$or: [{ email }, { userName }],
	});

	if (user) return user;
	return false;
};

userSchema.pre("save", async function (next) {
	const user = this;

	if (user.isModified("password")) {
		user.password = await bcryptjs.hash(
			user.password,
			config.security.saltRounds
		);
	}

	next();
});

const User = mongoose.model("User", userSchema);
export default User;
