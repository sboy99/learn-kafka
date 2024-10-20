import { TASK_REPOSITORY } from "@/app/constants/tokens";
import { Task } from "@/domain/entities";
import type { TaskRepositoryPort } from "@/repositories/ports";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class TaskService {
	constructor(
		@Inject(TASK_REPOSITORY)
		private readonly _taskRepository: TaskRepositoryPort,
	) {}

	public async create(title: string, description?: string): Promise<void> {
		const newTask = new Task({ title, description, status: "pending" });
		console.log(newTask);
		await this._taskRepository.createTask(newTask);
	}
}
