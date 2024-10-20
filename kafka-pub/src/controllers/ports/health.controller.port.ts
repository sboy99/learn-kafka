export interface HealthControllerPort {
	check(): Promise<"OK">;
}
