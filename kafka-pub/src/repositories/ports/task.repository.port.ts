import type { Task } from "@/domain/entities";

export interface TaskRepositoryPort {
	createTask(task: Task): Promise<void>;
}
