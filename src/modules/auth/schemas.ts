import z from "zod";

export const authenticateUserSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export const signupUserSchema = z.object({
	email: z.string().email(),
	password: z.string(),
	name: z.string(),
});
