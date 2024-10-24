import type { EventEnum } from "@/domain/enums";

export interface EventPort<T = unknown> {
	onCreate(...args: unknown[]): Promise<void>;
	publish(event: EventEnum, message: T): Promise<void>;
}
