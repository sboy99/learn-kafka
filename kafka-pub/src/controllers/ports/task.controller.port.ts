import type { TCreateTaskDto } from "../dtos";

export interface TaskControllerPort {
	createTask(dto: TCreateTaskDto): Promise<void>;
}
