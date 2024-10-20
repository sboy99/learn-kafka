import { z } from "zod";

export const CreateTaskTransformer = z.object({
	userId: z.string(),
	title: z.string(),
	description: z.string().optional(),
});
