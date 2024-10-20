import { TaskRepository } from "@/repositories";
import type { Provider } from "@nestjs/common";

export const Repositories: Provider[] = [TaskRepository];
