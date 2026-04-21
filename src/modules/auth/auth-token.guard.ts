import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { RequestWithUser } from "./dto";

export const IS_PUBLIC_METADATA_KEY = Symbol("isPublic");

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly reflector: Reflector,
		private readonly env: ConfigService,
	) {}

	private extractHeader(request: Request) {
		return request.headers.authorization?.split(" ")[1];
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(
			IS_PUBLIC_METADATA_KEY,
			[context.getClass(), context.getHandler()],
		);

		if (isPublic) return true;

		const request = context.switchToHttp().getRequest<RequestWithUser>();
		const token = this.extractHeader(request);

		if (!token) {
			return false;
		}

		try {
			const decoded = this.jwtService.verify(token, {
				secret: this.env.get("JWT_SECRET"),
			});

			request.user = decoded;
			return true;
		} catch {
			throw new UnauthorizedException("Invalid token");
		}
	}
}
