import { z } from "zod";

export const user = z.object({
	userName: z.string(),
	password: z.string(),
	email: z.string().email(),
	description: z.string().optional(),
});
