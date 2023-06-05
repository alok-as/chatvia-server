import { z } from "zod";

export const contact = z.object({
	name: z.string(),
	email: z.string().email(),
});
