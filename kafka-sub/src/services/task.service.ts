import { TASK_REPOSITORY } from "@/app/constants/tokens";
import { Task } from "@/domain/entities";
import type { TaskRepositoryPort } from "@/repositories/ports";
import { Inject, Injectable } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";

@Injectable()
export class TaskService {
	private readonly _createTaskRequestProcessThreshold: number;
	private readonly _createTaskRequestsList: Task[];

	constructor(
		@Inject(TASK_REPOSITORY)
		private readonly _taskRepository: TaskRepositoryPort,
	) {
		this._createTaskRequestProcessThreshold = 200;
		this._createTaskRequestsList = [];
	}

	// -------------------------------PUBLIC--------------------------------- //

	public async createTask(title: string, description?: string): Promise<void> {
		const newTask = new Task({
			title,
			description: description ?? null,
			status: "pending",
		});
		this._createTaskRequestsList.push(newTask);

		if (
			this._createTaskRequestsList.length >=
			this._createTaskRequestProcessThreshold
		) {
			this._processCreateTaskRequests();
		}
	}

	// -------------------------------PRIVATE--------------------------------- //

	@Interval(5_000) // 5 seconds
	private async _processCreateTaskRequests(): Promise<void> {
		if (this._createTaskRequestsList.length === 0) {
			return;
		}
		const tasksBatch = this._createTaskRequestsList.splice(
			0,
			this._createTaskRequestsList.length,
		);
		await this._taskRepository.createTasks(tasksBatch);
	}
}
