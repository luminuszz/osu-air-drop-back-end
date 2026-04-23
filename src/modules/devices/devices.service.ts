import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../auth/auth.service";
import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "../users/users.service";
import { CreateDeviceDto, PairDeviceDto } from "./dto";

@Injectable()
export class DevicesService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
		private readonly authService: AuthService,
	) {}

	async createDevice(data: CreateDeviceDto) {
		const existsUser = await this.usersService.findUserById(data.userId);

		if (!existsUser) {
			throw new BadRequestException("User not found");
		}

		const device = await this.prisma.device.findFirst({
			where: { name: data.name, userId: data.userId },
		});

		if (device) {
			return {
				deviceId: device.id,
				deviceName: device.name,
			};
		}

		const deviceCreated = await this.prisma.device.create({
			data: {
				name: data.name,
				type: data.type,
				userId: data.userId,
			},
		});

		return {
			deviceId: deviceCreated.id,
			deviceName: deviceCreated.name,
		};
	}

	async pairDevice(data: PairDeviceDto) {
		const { userId } = await this.jwtService.verifyAsync<{ userId: string }>(
			data.paringToken,
		);

		const existsUser = await this.usersService.findUserById(userId);

		if (!existsUser) {
			throw new BadRequestException("User not found");
		}

		const accessToken =
			await this.authService.generateAccessTokenByUser(existsUser);

		const existsDevice = await this.prisma.device.findFirst({
			where: { name: data.name, userId },
		});

		if (existsDevice) {
			return {
				accessToken,
				deviceId: existsDevice.id,
				deviceName: existsDevice.name,
			};
		}

		const deviceCreated = await this.prisma.device.create({
			data: {
				name: data.name,
				type: data.type,
				userId,
			},
			select: {
				name: true,
				id: true,
			},
		});

		return {
			accessToken,
			deviceId: deviceCreated.id,
			deviceName: deviceCreated.name,
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
