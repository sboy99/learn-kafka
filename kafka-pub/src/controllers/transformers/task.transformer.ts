import { z } from "zod";

export const CreateTaskTransformer = z.object({
	title: z.string(),
	description: z.string().optional(),
});
