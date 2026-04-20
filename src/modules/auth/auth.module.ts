import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth-token.guard";

@Global()
@Module({
	imports: [
		UsersModule,
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: (env: ConfigService) => ({
				secret: env.get("JWT_SECRET"),
				signOptions: { expiresIn: "10d" },
			}),
		}),
	],

	providers: [AuthService, AuthGuard, JwtService],
	exports: [AuthService, AuthGuard, JwtService],
	controllers: [AuthController],
})
export class AuthModule {}
