import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../auth/auth.service";
import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "../users/users.service";
import { CreateDeviceDto } from "./dto";

@Injectable()
export class DevicesService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
		private readonly authService: AuthService,
	) {}

	async createDevice(data: CreateDeviceDto): Promise<{ accessToken: string }> {
		const { userId } = await this.jwtService.verifyAsync<{ userId: string }>(
			data.paringToken,
		);

		console.log({ userId });

		const existsUser = await this.usersService.findUserById(userId);

		if (!existsUser) {
			throw new BadRequestException("User not found");
		}

		const existsDevice = await this.prisma.device.findFirst({
			where: {
				name: data.name,
				type: data.type,
			},
		});

		if (existsDevice) {
			await this.prisma.device.update({
				where: {
					id: existsDevice.id,
				},
				data: {
					userId,
				},
			});
		} else {
			await this.prisma.device.create({
				data: {
					name: data.name,
					type: data.type,
					userId,
				},
			});
		}

		const accessToken =
			await this.authService.generateAccessTokenByUser(existsUser);

		return {
			accessToken,
		};
	}

	async fetchDevicesByUserId(userId: string) {
		const devices = await this.prisma.device.findMany({
			where: {
				userId,
			},
		});

		return devices.map((device) => ({
			id: device.id,
			name: device.name,
			type: device.type,
		}));
	}
}
