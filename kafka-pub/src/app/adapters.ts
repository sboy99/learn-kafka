import { KafkaAdapter } from "@/adapters";
import type { Provider } from "@nestjs/common";
import { EVENT_ADAPTER } from "./constants/tokens";

export const Adapters: Provider[] = [
	{
		provide: EVENT_ADAPTER,
		useClass: KafkaAdapter,
	},
];
