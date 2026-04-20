import { Module } from "@nestjs/common";
import { FilesService } from "./files.service";

@Module({
	providers: [FilesService],
	controllers: [],
})
export class FilesModule {}
