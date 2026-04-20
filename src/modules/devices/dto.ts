import { DeviceCreateInput } from "../prisma/generated/models";

export interface CreateDeviceDto
	extends Pick<DeviceCreateInput, "name" | "type"> {
	paringToken: string;
}
