import { Body, Controller, Get, Post } from "@nestjs/common";
import { ZodValidationPipe } from "src/core/zod/zod-validation.pipe";
import z from "zod";
import { IsPublic } from "../auth/is-public.decorator";
import { UserDecoded } from "../auth/user-decoded.decorator";
import { DevicesService } from "./devices.service";
import {
	type CreateDeviceSchema,
	createDeviceSchema,
	makePairSchema,
} from "./schema";

@Controller("devices")
export class DevicesController {
	constructor(private readonly devicesService: DevicesService) {}

	@Get("")
	async fetchUserDevices(@UserDecoded("id") userId: string) {
		const devices = await this.devicesService.fetchDevicesByUserId(userId);

		return devices;
	}

	@Post("")
	async createDevice(
		@UserDecoded("id") userId: string,
		@Body(new ZodValidationPipe(createDeviceSchema)) body: CreateDeviceSchema,
	) {
		return this.devicesService.createDevice({
			name: body.name,
			type: body.type,
			userId,
		});
	}

	@IsPublic()
	@Post("/pair")
	async makePair(
		@Body(new ZodValidationPipe(makePairSchema)) body: z.infer<
			typeof makePairSchema
		>,
	) {
		const { accessToken, deviceId, deviceName } =
			await this.devicesService.pairDevice({
				name: body.name,
				type: body.type,
				paringToken: body.paringToken,
			});

		return {
			accessToken,
			deviceId,
			deviceName,
		};
	}
}
