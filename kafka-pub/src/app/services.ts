import { HealthService } from "@/services";
import type { Provider } from "@nestjs/common";

export const Services: Provider[] = [HealthService];
