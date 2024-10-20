import type { Task } from "@/domain/entities";
import { DbHelper } from "@/helpers";
import type { TaskRepositoryPort } from "@/repositories/ports";
import { tasks as tasksTable } from "@db/schema";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class TaskRepository implements TaskRepositoryPort {
	constructor(@Inject(DbHelper) private readonly _pgHelper: DbHelper) {}

	public async createTasks(tasks: Task[]): Promise<void> {
		await this._pgHelper.db.insert(tasksTable).values(tasks);
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
