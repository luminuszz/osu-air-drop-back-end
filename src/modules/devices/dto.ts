import { DeviceCreateInput } from "../prisma/generated/models";

export interface PairDeviceDto
	extends Pick<DeviceCreateInput, "name" | "type"> {
	paringToken: string;
}

export interface CreateDeviceDto
	extends Pick<DeviceCreateInput, "name" | "type"> {
	userId: string;
}
