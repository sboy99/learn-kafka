import { HealthController, TaskController } from "@/controllers";
import type { Type } from "@nestjs/common/interfaces";

export const Controllers: Type<any>[] = [HealthController, TaskController];
