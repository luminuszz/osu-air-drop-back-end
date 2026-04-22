import { z } from "zod";
import { DeviceType } from "../prisma/generated/enums";

export const makePairSchema = z.object({
	type: z.enum(DeviceType),
	name: z.string(),
	paringToken: z.jwt(),
});

export const createDeviceSchema = makePairSchema.omit({ paringToken: true });

export type CreateDeviceSchema = z.infer<typeof createDeviceSchema>;
