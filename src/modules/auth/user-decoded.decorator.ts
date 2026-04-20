import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserTokenDecoded } from "./dto";

export const UserDecoded = createParamDecorator(
	(data: keyof UserTokenDecoded | undefined, context: ExecutionContext) => {
		return data
			? context.switchToHttp().getRequest().user[data]
			: context.switchToHttp().getRequest().user;
	},
);
