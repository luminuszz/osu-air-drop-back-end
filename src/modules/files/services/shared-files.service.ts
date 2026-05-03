import { randomBytes } from "node:crypto";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SharedFile } from "src/modules/prisma/generated/client";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { StorageProvider } from "../providers/storage.provider";

@Injectable()
export class SharedFileService {
	constructor(
		private readonly prisma: PrismaService,
		private storage: StorageProvider,
	) {}

	private readonly EXPIRATION_TIME_IN_MINUTES = 10;

	async shareFile(fileId: string, userId: string) {
		const now = new Date();

		const expiresAt = new Date(
			now.setMinutes(now.getMinutes() + this.EXPIRATION_TIME_IN_MINUTES),
		);

		const accessKey = randomBytes(16).toString("hex");

		await this.prisma.sharedFile.create({
			data: {
				fileId,
				recipientId: userId,
				accessKey,
				expiresAt,
			},
		});

		return {
			accessKey,
			expiresAt,
		};
	}

	async fetchSharedDownloadLink(accessKey: string) {
		const sharedFile = await this.prisma.sharedFile.findUnique({
			where: {
				accessKey: accessKey,
			},
		});

		const now = new Date();

		if (!sharedFile || sharedFile.expiresAt < now) {
			throw new BadRequestException("invalid sharedFile");
		}

		const downloadUrl = await this.storage.generateDownloadUrl(
			sharedFile.fileId,
			true,
		);

		return { downloadUrl };
	}
}
