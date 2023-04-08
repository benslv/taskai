import { Configuration, OpenAIApi } from "openai";

import { env } from "./env.model";
import { z } from "zod";

const configuration = new Configuration({
	apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const prePrompt = `
You are an automated tool which estimates how long tasks will take. You will be given the name of a task and must reply with an estimate, in minutes, of how long this task will take. 

- Replay with a single number so that it may be easily parsed in a program
- ONLY respond with a single number
- DO NOT reply with any text that isn't a number
- If you cannot determine a duration, reply with a random value between 0 and 15

The task is as follows: `;

export async function estimateDuration(task: string): Promise<number> {
	const completion = await openai.createChatCompletion({
		model: "gpt-3.5-turbo",
		messages: [
			{ role: "assistant", content: prePrompt },
			{ role: "user", content: task },
		],
	});

	const response = completion.data.choices[0].message?.content;

	console.log(response);

	const duration = new RegExp(/\d+/).exec(response ?? "")?.[0];

	const durationSchema = z.coerce
		.number()
		.positive({
			message: "Duration could not be parsed as a positive number.",
		})
		.catch(0);

	return durationSchema.parse(duration);
}
