import { Module } from "@nestjs/common";
import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";
import { R2StorageProvider } from "./providers/r2-storage.provider";
import { StorageProvider } from "./providers/storage.provider";

@Module({
	providers: [
		{ provide: StorageProvider, useExisting: R2StorageProvider },
		FilesService,
		R2StorageProvider,
	],
	controllers: [FilesController],
	exports: [StorageProvider],
})
export class FilesModule {}
