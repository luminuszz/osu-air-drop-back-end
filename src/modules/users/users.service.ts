import { BadRequestException, Injectable } from "@nestjs/common";
import * as argo from "argon2";
import { User } from "../prisma/generated/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuthenticateUserDto, CreateUserDto } from "./dto";

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async createUser({ email, name, password }: CreateUserDto) {
		const userExists = await this.prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (userExists) {
			throw new BadRequestException("User already exists");
		}

		const passwordHash = await argo.hash(password);

		await this.prisma.user.create({
			data: {
				email,
				name,
				password: passwordHash,
			},
		});
	}

	async validateUser({
		email,
		password,
	}: AuthenticateUserDto): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) return null;

		const passwordMatch = await argo.verify(user.password, password);

		if (!passwordMatch) return null;

		return user;
	}
}
