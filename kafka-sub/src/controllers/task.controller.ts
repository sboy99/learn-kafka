import type { TaskControllerPort } from "@/controllers/ports";
import { TaskService } from "@/services";
import { Body, Controller, Inject, Post } from "@nestjs/common";
import type { TCreateTaskDto } from "./dtos";
import { CreateTaskTransformer } from "./transformers";

@Controller("tasks")
export class TaskController implements TaskControllerPort {
	constructor(
		@Inject(TaskService) private readonly _taskService: TaskService,
	) {}

	@Post()
	public async create(@Body() dto: TCreateTaskDto): Promise<void> {
		const { userId, title, description } =
			await CreateTaskTransformer.parseAsync(dto);
		await this._taskService.createTask(userId, title, description);
	}
}
