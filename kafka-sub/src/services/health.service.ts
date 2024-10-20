import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthService {
	public async check(): Promise<"OK"> {
		return "OK";
	}
}
