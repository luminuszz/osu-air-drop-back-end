import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

(async () => {
	const app = await NestFactory.create(AppModule);

	const env = app.get(ConfigService);

	await app.listen(env.get("PORT") ?? 3000);
})();
