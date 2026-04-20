import { z } from "zod";
import { DeviceType } from "../prisma/generated/enums";

export const makePairSchema = z.object({
	type: z.enum(DeviceType),
	name: z.string(),
	paringToken: z.jwt(),
});
