import type { TaskControllerPort } from "@/controllers/ports";
import { TaskService } from "@/services";
import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Inject,
	Post,
} from "@nestjs/common";
import type { TCreateTaskDto } from "./dtos";
import { CreateTaskTransformer } from "./transformers";

@Controller("tasks")
export class TaskController implements TaskControllerPort {
	constructor(
		@Inject(TaskService) private readonly _taskService: TaskService,
	) {}

	@HttpCode(HttpStatus.CREATED)
	@Post()
	public async createTask(@Body() dto: TCreateTaskDto): Promise<void> {
		const { title, description } = await CreateTaskTransformer.parseAsync(dto);
		await this._taskService.create(title, description);
	}
}
