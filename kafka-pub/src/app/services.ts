import { HealthService, TaskService } from "@/services";
import type { Provider } from "@nestjs/common";

export const Services: Provider[] = [HealthService, TaskService];
