import { z } from "zod";

export const chatMessage = z.object({
	chatRoomId: z.string(),
	message: z.string(),
});
