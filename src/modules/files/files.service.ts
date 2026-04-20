import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UploadFileDto } from "./dto";
import { StorageProvider } from "./providers/storage.provider";

@Injectable()
export class FilesService {
	constructor(
		private readonly storageProvider: StorageProvider,
		private readonly prisma: PrismaService,
	) {}

	async makeUploadFileRequest(data: UploadFileDto) {
		const { fileId, url } = await this.storageProvider.generateUploadUrl({
			filename: data.filename,
			filetype: data.fileType,
			userId: data.userId,
		});

		return {
			uploadUrl: url,
			fileId,
		};
	}

	async confirmUpload(
		fileId: string,
		userId: string,
		deviceId: string,
		originalName?: string,
	) {
		const fileMeta = await this.storageProvider.getFileMetadata(fileId);

		if (!fileMeta) {
			throw new BadRequestException("File not found");
		}

		const file = await this.prisma.file.create({
			data: {
				mimeType: fileMeta.fileType,
				senderId: deviceId,
				storagePath: "r2-bucket",
				userId,
				originalName: originalName ?? fileId,
				size: fileMeta.size,
			},
			include: {
				sender: true,
			},
		});

		return file;
	}

	async getDownloadUrl(fileId: string) {
		const url = await this.storageProvider.generateDownloadUrl(fileId);

		return url;
	}

	async fetchUserFiles(userId: string) {
		const userFiles = await this.prisma.file.findMany({
			where: { userId },
			include: { sender: true },
		});

		return userFiles.map((item) => ({
			id: item.id,
			originalName: item.originalName,
			mimeType: item.mimeType,
			size: item.size,
			sender: item.sender,
		}));
	}
}
