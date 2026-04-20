import { Request } from "express";

export interface UserTokenDecoded {
	name: string;
	id: string;
	email: string;
}

export interface RequestWithUser extends Request {
	user: UserTokenDecoded;
}
