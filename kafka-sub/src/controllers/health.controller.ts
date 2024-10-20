import type { HealthControllerPort } from "@/controllers/ports";
import { HealthService } from "@/services";
import { Controller, Get, Inject } from "@nestjs/common";

@Controller()
export class HealthController implements HealthControllerPort {
	constructor(
		@Inject(HealthService) private readonly _healthService: HealthService,
	) {}

	@Get()
	public async check() {
		return this._healthService.check();
	}
}
