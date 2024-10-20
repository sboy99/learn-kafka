import type { TCreateTaskDto } from "../dtos";

export interface TaskControllerPort {
	create(dto: TCreateTaskDto): Promise<void>;
}
