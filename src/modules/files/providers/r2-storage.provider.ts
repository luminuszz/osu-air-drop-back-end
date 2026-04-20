import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { StorageProvider, UploadUrlParams } from "./storage.provider";

@Injectable()
export class R2StorageProvider implements StorageProvider, OnModuleInit {
	constructor(private readonly env: ConfigService) {}

	async getFileMetadata(
		fileId: string,
	): Promise<{ fileType: string; fileId: string; size: number }> {
		const getFileMetadata = new GetObjectCommand({
			Key: fileId,
			Bucket: this.bucketName,
		});

		const { ContentType, ContentLength } =
			await this.s3Client.send(getFileMetadata);

		return {
			fileType: ContentType ?? "",
			fileId,
			size: ContentLength ?? 0,
		};
	}

	private s3Client: S3Client;
	private bucketName: string;

	onModuleInit() {
		this.bucketName = this.env.getOrThrow<string>("R2_BUCKER_NAME");

		this.s3Client = new S3Client({
			region: "auto",
			endpoint: this.env.getOrThrow<string>("R2_STORAGE_URL"),
			credentials: {
				accessKeyId: this.env.getOrThrow<string>("R2_STORAGE_KEY"),
				secretAccessKey: this.env.getOrThrow<string>("R2_STORAGE_SECRET_KEY"),
			},
		});
	}

	async generateUploadUrl(fileMeta: UploadUrlParams) {
		const fileId = `${fileMeta.userId}/${Date.now().toString()}-${fileMeta.filename}`;

		const command = new PutObjectCommand({
			Bucket: this.bucketName,
			Key: fileId,
			ContentType: fileMeta.filetype,
		});

		const url = await getSignedUrl(this.s3Client, command, {
			expiresIn: 900,
		});

		return {
			fileId,
			url,
		};
	}

	async generateDownloadUrl(fileId: string): Promise<string> {
		const command = new GetObjectCommand({
			Key: fileId,
			Bucket: this.bucketName,
		});

		return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
	}
}
