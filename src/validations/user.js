import { z } from "zod";

export const user = z.object({
	username: z.string(),
	password: z.string(),
	email: z.string().email(),
	description: z.string().optional(),
});

export const login = z.object({
	usernameOrEmail: z.string().or(z.string().email()),
	password: z.string(),
});
