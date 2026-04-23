import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "./modules/auth/auth.module";
import { AuthGuard } from "./modules/auth/auth-token.guard";
import { DeviceModules } from "./modules/devices/devices.module";
import { EventsModule } from "./modules/events/events.module";
import { FilesModule } from "./modules/files/files.module";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		JwtModule.registerAsync({
			inject: [ConfigService],
			global: true,
			useFactory: (env: ConfigService) => {
				return {
					secret: env.get("JWT_SECRET"),
					signOptions: { expiresIn: "30d" },
				};
			},
		}),
		PrismaModule,
		AuthModule,
		UsersModule,
		DeviceModules,
		FilesModule,
		EventsModule,
	],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
})
export class AppModule {}
