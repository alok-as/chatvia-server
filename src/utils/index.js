import path from "path";
import { fileURLToPath } from "url";

import jwt from "jsonwebtoken";
import config from "../config/index.js";

export const asyncHandler = (fn) => (req, res, next) => {
	return Promise.resolve(fn(req, res, next)).catch(next);
};

export const getDirName = (url) => {
	const __filename = fileURLToPath(url);
	const __dirname = path.dirname(__filename);
	return __dirname;
};

export const computeTime = (value, unit) => {
	switch (unit) {
		case "seconds":
			return value;
		case "minutes":
			return value * 60;
		case "hours":
			return value * 60 * 60;
		case "days":
			return value * 60 * 60 * 24;
		default:
			return value;
	}
};

export const getAuthTokenExpirations = () => {
	const [accessValue, accessUnit] = config.security.accessExpiry.split(" ");
	const [refreshValue, refreshUnit] =
		config.security.refreshExpiry.split(" ");

	const accessExpiry = computeTime(accessValue, accessUnit);
	const refreshExpiry = computeTime(refreshValue, refreshUnit);

	return { accessExpiry, refreshExpiry };
};

export const generateJWTToken = (payload, expiresIn) =>
	jwt.sign(payload, config.security.jwtSecret, {
		expiresIn,
	});

export const verifyJWTToken = (token) => {
	try {
		const decoded = jwt.verify(token, config.security.jwtSecret);
		return decoded;
	} catch (error) {
		return null;
	}
};

export const generateAuthTokens = async (payload) => {
	const { accessExpiry, refreshExpiry } = getAuthTokenExpirations();

	return Promise.all([
		generateJWTToken(payload, accessExpiry),
		generateJWTToken(payload, refreshExpiry),
	]);
};

export const aggregatePipelines = async (Model, pipelines) => {
	const [result] = await Model.aggregate([
		{
			$facet: pipelines,
		},
	]);

	return result;
};

export const parseQueryParams = (queryParams) => {
	const defaultParams = {
		page: 1,
		perPage: 10,
	};

	let { page, perPage } = Object.assign(defaultParams, queryParams);
	page = parseInt(page, 10);
	perPage = parseInt(perPage, 10);

	return {
		page,
		perPage,
		skip: (page - 1) * perPage,
		limit: perPage,
	};
};
