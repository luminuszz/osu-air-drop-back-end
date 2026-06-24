import { Module } from "@nestjs/common";
import { EventsModule } from "../events/events.module";
import { FilesController } from "./files.controller";
import { R2StorageProvider } from "./providers/r2-storage.provider";
import { StorageProvider } from "./providers/storage.provider";
import { FilesService } from "./services/files.service";
import { SharedFileService } from "./services/shared-files.service";

@Module({
	imports: [EventsModule],
	providers: [
		{ provide: StorageProvider, useExisting: R2StorageProvider },
		FilesService,
		R2StorageProvider,
		EventsModule,
		SharedFileService,
	],
	controllers: [FilesController],
	exports: [StorageProvider],
})
export class FilesModule {}
