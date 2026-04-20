export interface UploadUrlParams {
	filename: string;
	filetype: string;
	userId: string;
}

export abstract class StorageProvider {
	abstract generateUploadUrl(fileMeta: UploadUrlParams): Promise<{
		url: string;
		fileId: string;
	}>;

	abstract generateDownloadUrl(fileId: string): Promise<string>;

	abstract getFileMetadata(
		fileId: string,
	): Promise<{ fileType: string; fileId: string; size: number }>;
}
