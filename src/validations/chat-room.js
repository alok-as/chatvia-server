import { z } from "zod";

export const chatRoom = z.object({
	userIds: z.array(z.string()),
});
