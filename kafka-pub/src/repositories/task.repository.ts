import type { Task } from "@/domain/entities";
import { MessageBrokerTopicEnum } from "@/domain/enums";
import { MessageBrokerHelper } from "@/helpers";
import { Inject, Injectable, type OnModuleInit } from "@nestjs/common";
import type { TaskRepositoryPort } from "./ports";

@Injectable()
export class TaskRepository implements TaskRepositoryPort, OnModuleInit {
	private readonly _taskTopics: MessageBrokerTopicEnum[];

	constructor(
		@Inject(MessageBrokerHelper)
		private readonly _messageBrokerHelper: MessageBrokerHelper,
	) {
		this._taskTopics = [MessageBrokerTopicEnum.TASK_CREATED];
	}

	async onModuleInit(): Promise<void> {
		await this._messageBrokerHelper.createTopics(this._taskTopics);
	}

	// -------------------------------PUBLIC--------------------------------- //

	public async createTask(task: Task): Promise<void> {
		await this._messageBrokerHelper.publishMessage(
			MessageBrokerTopicEnum.TASK_CREATED,
			{
				value: JSON.stringify(task),
			},
		);
	}
}
