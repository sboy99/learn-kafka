import type { TaskControllerPort } from "@/controllers/ports";
import { MessageBrokerTopicEnum } from "@/domain/enums";
import { MessageBrokerHelper } from "@/helpers";
import { TaskService } from "@/services";
import { Controller, Inject, type OnModuleInit } from "@nestjs/common";
import type { TCreateTaskDto } from "./dtos";
import { CreateTaskTransformer } from "./transformers";

@Controller()
export class TaskController implements TaskControllerPort, OnModuleInit {
	constructor(
		@Inject(MessageBrokerHelper)
		private readonly _messageBrokerHelper: MessageBrokerHelper,
		@Inject(TaskService)
		private readonly _taskService: TaskService,
	) {}

	async onModuleInit(): Promise<void> {
		await this._addConsumers();
	}

	// -------------------------------PUBLIC--------------------------------- //

	public async createTask(dto: TCreateTaskDto): Promise<void> {
		const { title, description } = await CreateTaskTransformer.parseAsync(dto);
		await this._taskService.createTask(title, description);
	}

	// -------------------------------PRIVATE-------------------------------- //

	private async _addConsumers(): Promise<void> {
		await Promise.all([this._addTaskCreatedConsumer()]);
	}

	private async _addTaskCreatedConsumer(): Promise<void> {
		await this._messageBrokerHelper.consume(
			MessageBrokerTopicEnum.TASK_CREATED,
			{
				eachMessage: async ({ message }) => {
					if (!message.value) {
						return;
					}
					const taskDto = JSON.parse(message.value.toString());
					await this.createTask(taskDto);
				},
			},
		);
	}
}
