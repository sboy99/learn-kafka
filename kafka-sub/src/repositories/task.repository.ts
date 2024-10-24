import type { DbAdapter } from "@/adapters";
import { DB_ADAPTER } from "@/app/constants/tokens";
import type { Task } from "@/domain/entities";
import type { TaskRepositoryPort } from "@/repositories/ports";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class TaskRepository implements TaskRepositoryPort {
	constructor(
		@Inject(DB_ADAPTER) private readonly _dbAdapter: DbAdapter<"TASKS">,
	) {}

	public async createTasks(tasks: Task[]): Promise<void> {
		await this._dbAdapter.insertMany("TASKS", tasks);
	}

	getTasks(): Promise<Task[]> {
		throw new Error("Method not implemented.");
	}
	getTaskById(id: string): Promise<Task> {
		throw new Error("Method not implemented.");
	}
	updateTask(id: string, task: Task): Promise<Task> {
		throw new Error("Method not implemented.");
	}
	deleteTask(id: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
