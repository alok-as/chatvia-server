import mongoose from "mongoose";
import { z } from "zod";

const contactSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		name: {
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
		contactId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		isRegistered: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

contactSchema.statics.checkIfExistingContact = async function (user, email) {
	const schema = this;
	const contact = await schema.findOne({ user, email });
	return contact ? true : false;
};

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
