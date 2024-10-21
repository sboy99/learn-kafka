import type { TConfig } from "@/app/modules/config";
import type { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import * as compression from "compression";
import { AppModule } from "./app/app.module";

async function bootstrap() {
	const app = await NestFactory.create<INestApplication>(AppModule);

	// compression //
	app.use(compression());

	// cofiguration //
	const configService = app.get<ConfigService<TConfig>>(ConfigService);

	// start server //
	const port = configService.getOrThrow<number>("APP_HTTP_PORT");
	await app.listen(port);
}
bootstrap();
