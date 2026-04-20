import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { DevicesController } from "./devices.controller";
import { DevicesService } from "./devices.service";

@Module({
	imports: [UsersModule],
	providers: [DevicesService],
	controllers: [DevicesController],
})
export class DeviceModules {}
