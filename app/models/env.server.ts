import { z } from "zod";

const envSchema = z.object({
	OPENAI_API_KEY: z
		.string()
		.nonempty({ message: "OPENAI_API_KEY is required" }),
});

export const env = envSchema.parse(process.env);
