import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ZodValidationPipe } from "src/core/zod/zod-validation.pipe";
import { UserDecoded } from "../auth/user-decoded.decorator";
import { FilesService } from "./files.service";
import {
	type ConfirmUploadSchema,
	confirmUploadSchema,
	type MakeUploadRequestSchema,
	makeUploadRequestSchema,
} from "./schema";

@Controller("files")
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Get()
	async getUserFiles(@UserDecoded("id") userId: string) {
		return this.filesService.fetchUserFiles(userId);
	}

	@Post("/upload/request")
	async makeUploadRequest(
		@UserDecoded("id") userId: string,
		@Body(new ZodValidationPipe(makeUploadRequestSchema))
		body: MakeUploadRequestSchema,
	) {
		const results = await this.filesService.makeUploadFileRequest({
			fileType: body.filetype,
			userId,
			filename: body.filename,
		});

		return results;
	}

	@Post("/upload/confirm")
	async confirmUpload(
		@UserDecoded("id") userId: string,
		@Body(new ZodValidationPipe(confirmUploadSchema)) body: ConfirmUploadSchema,
	) {
		const results = await this.filesService.confirmUpload(
			body.fileId,
			userId,
			body.originalFilename,
		);

		return {
			success: true,
			filename: results.originalName,
			sender: results.sender,
		};
	}

	x;
	@Get("download/:fileId")
	async getDownloadUrl(@Param("fileId") fileId: string) {
		const url = await this.filesService.getDownloadUrl(fileId);

		return { url };
	}
}
