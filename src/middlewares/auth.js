import User from "../models/user.js";
import { generateAuthTokens, verifyJWTToken } from "../utils/index.js";

export const authenticated = async (req, res, next) => {
	try {
		const accessToken = req.headers["Authorization"];
		const refreshToken = req.headers["Refresh-Token"];

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
