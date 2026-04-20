import { UserCreateInput } from "../prisma/generated/models";

export interface CreateUserDto
	extends Pick<UserCreateInput, "email" | "password" | "name"> {}

export interface AuthenticateUserDto
	extends Pick<UserCreateInput, "email" | "password"> {}
