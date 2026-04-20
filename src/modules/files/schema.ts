import z from "zod";

export const makeUploadRequestSchema = z.object({
	filename: z.string(),
	filetype: z.string(),
});

export type MakeUploadRequestSchema = z.infer<typeof makeUploadRequestSchema>;

export const confirmUploadSchema = z.object({
	fileId: z.string(),
	originalFilename: z.string(),
	deviceId: z.string(),
});

export type ConfirmUploadSchema = z.infer<typeof confirmUploadSchema>;
