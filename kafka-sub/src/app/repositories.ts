import { TASK_REPOSITORY } from "@/app/constants/tokens";
import { TaskRepository } from "@/repositories";
import type { Provider } from "@nestjs/common";

export const Repositories: Provider[] = [
	{
		provide: TASK_REPOSITORY,
		useClass: TaskRepository,
	},
];
