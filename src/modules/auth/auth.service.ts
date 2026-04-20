import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { UserTokenDecoded } from "./dto";

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	async authenticate(
		email: string,
		password: string,
	): Promise<{ accessToken: string }> {
		const user = await this.usersService.validateUser({ email, password });

		if (!user) {
			throw new BadRequestException("Invalid credentials");
		}

		const payload = {
			email: user.email,
			id: user.id,
			name: user.email,
		} satisfies UserTokenDecoded;

		const accessToken = await this.jwtService.signAsync(
			JSON.stringify(payload),
		);

		return { accessToken };
	}
}
