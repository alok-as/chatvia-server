import { fromZodError } from "zod-validation-error";

export const validate =
	(schema, property = "body") =>
	(req, res, next) => {
		const { error, success } = schema.safeParse(req[property]);
		if (success) return next();

		res.status(422);
		const message = fromZodError(error);
		console.log("error", message);
		throw new Error(message);
	};

export const notFound = (req, res, next) => {
	const error = new Error(`Path- ${req.path} is not found `);
	res.status(404);
	next(error);
};

export const errorHandler = (err, _req, res, _next) => {
	const message = err.message || "Something went wrong";
	res.statusCode = res.statusCode === 200 ? 500 : res.statusCode;

	res.send({
		data: null,
		success: false,
		message: message,
	});
};
