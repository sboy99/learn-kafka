import { TaskRepository } from "@/repositories";
import type { Provider } from "@nestjs/common";
import { TASK_REPOSITORY } from "./constants/tokens";

export const Repositories: Provider[] = [
	{
		provide: TASK_REPOSITORY,
		useClass: TaskRepository,
	},
];
