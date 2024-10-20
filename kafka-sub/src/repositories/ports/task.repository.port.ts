import type { Task } from "@/domain/entities";

export interface TaskRepositoryPort {
	createTasks(tasks: Task[]): Promise<void>;
	getTasks(): Promise<Task[]>;
	getTaskById(id: string): Promise<Task>;
	updateTask(id: string, task: Task): Promise<Task>;
	deleteTask(id: string): Promise<void>;
}
