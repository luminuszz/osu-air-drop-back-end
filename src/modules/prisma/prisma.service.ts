import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client";

@Injectable()
export class PrismaService extends PrismaClient {
	constructor(env: ConfigService) {
		const adapter = new PrismaPg({ connectionString: env.get("DATABASE_URL") });

		super({ adapter });
	}
}
