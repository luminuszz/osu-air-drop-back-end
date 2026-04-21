import { Body, Controller, Post } from "@nestjs/common";
import { ZodValidationPipe } from "src/core/zod/zod-validation.pipe";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { IsPublic } from "./is-public.decorator";
import { authenticateUserSchema, signupUserSchema } from "./schemas";
import { UserDecoded } from "./user-decoded.decorator";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
	) {}

	@IsPublic()
	@Post("signin")
	async login(
		@Body(new ZodValidationPipe(authenticateUserSchema)) body: {
			email: string;
			password: string;
		},
	) {
		return this.authService.authenticate(body.email, body.password);
	}

	@IsPublic()
	@Post("signup")
	async signup(
		@Body(new ZodValidationPipe(signupUserSchema)) body: {
			email: string;
			password: string;
			name: string;
		},
	) {
		await this.usersService.createUser({
			email: body.email,
			name: body.name,
			password: body.password,
		});
	}

	@Post("/invite")
	async generateInviteToken(@UserDecoded("id") userId: string) {
		const token = await this.authService.generateAccessTokenByUserId(userId);

		return {
			inviteToken: token,
		};
	}
}
