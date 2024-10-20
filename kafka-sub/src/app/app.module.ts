import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { Adapters } from "./adapters";
import { Controllers } from "./controllers";
import { Helpers } from "./helpers";
import { ConfigModule } from "./modules/config";
import { Services } from "./services";

@Module({
	imports: [ConfigModule, ScheduleModule.forRoot()],
	controllers: [...Controllers],
	providers: [...Services, ...Helpers, ...Adapters],
})
export class AppModule {}
