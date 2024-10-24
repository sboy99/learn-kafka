import type { EventPort } from "@/adapters/ports";
import { EVENT_ADAPTER } from "@/app/constants/tokens";
import type { Task } from "@/domain/entities";
import { EventEnum } from "@/domain/enums";
import { Inject, Injectable, type OnModuleInit } from "@nestjs/common";
import type { TaskRepositoryPort } from "./ports";

@Injectable()
export class TaskRepository implements TaskRepositoryPort, OnModuleInit {
	private readonly _taskTopics: EventEnum[];

	constructor(
		@Inject(EVENT_ADAPTER)
		private readonly _eventAdapter: EventPort<Task>,
	) {
		this._taskTopics = [EventEnum.TASK_CREATED];
	}

	async onModuleInit(): Promise<void> {
		await this._eventAdapter.onCreate(this._taskTopics);
	}

	// -------------------------------PUBLIC--------------------------------- //

	public async createTask(task: Task): Promise<void> {
		await this._eventAdapter.publish(EventEnum.TASK_CREATED, task);
	}
}
