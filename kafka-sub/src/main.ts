import type { TConfig } from "@/app/modules/config";
import { HttpStatus, type INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import * as compression from "compression";
import helmet from "helmet";
import { AppModule } from "./app/app.module";

async function bootstrap() {
	const app = await NestFactory.create<INestApplication>(AppModule);

	// security //
	app.use(helmet());

	// compression //
	app.use(compression());

	// cors //
	app.enableCors({
		origin: [],
		methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
		credentials: true,
		optionsSuccessStatus: HttpStatus.NO_CONTENT,
	});

	// cofiguration //
	const configService = app.get<ConfigService<TConfig>>(ConfigService);

	const port = configService.getOrThrow<number>("APP_HTTP_PORT");
	await app.listen(port, () => console.log(`App is running on port ${port}`));
}
bootstrap();
