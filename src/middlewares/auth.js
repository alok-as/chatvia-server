import User from "../models/user.js";
import { generateAuthTokens, verifyJWTToken } from "../utils/index.js";

export const authenticated = async (req, res, next) => {
	try {
		console.log("headers", req.headers);
		const accessToken = req.headers["authorization"].replace("Bearer ", "");
		const refreshToken = req.headers["refresh-token"];

		console.log("accessToken", accessToken);
		console.log("refreshToken", refreshToken);

		if (accessToken) {
			const decoded = verifyJWTToken(accessToken);

			if (decoded) {
				const { id, name } = decoded;
				const user = await User.findOne({ _id: id, username: name });

				if (user) {
					req.user = user;
					return next();
				}
			}
		}

		if (refreshToken) {
			const decoded = verifyJWTToken(refreshToken);
			if (decoded) {
				const { id, name } = decoded;
				const user = await User.findOne({ _id: id, username: name });

				if (user) {
					const [accessToken, refreshToken] =
						await generateAuthTokens({
							id: user._id,
							name: user.username,
						});

					return res.status(401).send({
						message: "Tokens successfully resissued",
						success: true,
						code: 490,
						data: {
							accessToken,
							refreshToken,
						},
					});
				}
			}
		}

		throw new Error("User not Authenticated");
	} catch (error) {
		res.status(401);
		next(error);
	}
};
