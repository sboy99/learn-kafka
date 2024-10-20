import type { z } from "zod";
import type { CreateTaskTransformer } from "../transformers";

export type TCreateTaskDto = z.infer<typeof CreateTaskTransformer>;
