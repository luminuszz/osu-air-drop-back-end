import { Controller, Get } from "@nestjs/common";
import { UserDecoded } from "../auth/user-decoded.decorator";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get("me")
	async getMe(@UserDecoded("id") userId: string) {
		const user = await this.usersService.findUserById(userId);

		return {
			id: user.id,
			name: user.name,
			email: user.email,
		};
	}
}
