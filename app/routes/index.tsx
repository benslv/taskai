import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { Plus } from "iconoir-react";
import { useEffect, useRef } from "react";
import useLocalStorage from "use-local-storage";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { estimateDuration } from "~/models/ai.model";

type Task = {
	id: string;
	title: string;
	duration: number;
};

const taskSchema = z.object({
	name: z
		.string()
		.min(1, { message: "You have to enter a task name." })
		.max(100, { message: "Task name is too long (max 50 characters)." }),
});

export async function action({ request }: ActionArgs) {
	const body = await request.formData();

	const result = taskSchema.safeParse({
		name: body.get("task"),
	});

	if (!result.success) {
		return json({
			ok: false as const,
			error: result.error,
		});
	}

	const task = result.data;

	const randomDuration = await estimateDuration(task.name);

	return json({
		ok: true as const,
		task: {
			id: uuidv4(),
			title: task.name,
			duration: randomDuration,
		},
	});
}

export default function Index() {
	const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);

	const todoFetcher = useFetcher<typeof action>();
	const data = todoFetcher.data;
	const isSubmitting = todoFetcher.state === "submitting";

	const deletedId = useRef("");
	const inputRef = useRef<HTMLFormElement>(null);

	const deleteTask = (id: string) => {
		deletedId.current = id;
		setTasks(tasks.filter((task) => task.id !== id));
	};

	useEffect(() => {
		if (!data?.ok) return () => {};
		if (data.task.id === tasks[tasks.length - 1]?.id) return () => {};
		if (data.task.id === deletedId.current) return () => {};

		setTasks([...tasks, data.task]);
		inputRef.current?.reset();
	});

	return (
		<div className="mx-auto flex h-full max-w-xl flex-col justify-center gap-y-4">
			<div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4 shadow">
				<h2 className="mb-2 text-xl text-zinc-200">Tasks</h2>

				{tasks.length > 0 ? (
					<>
						<p className="mb-1 text-sm text-zinc-400">Current task</p>
						<div className="flex flex-col gap-y-2">
							<div
								key={tasks[0].id}
								onClick={() => deleteTask(tasks[0].id)}
								className="flex cursor-pointer justify-between rounded-md border border-zinc-600 bg-zinc-700 bg-gradient-to-r from-zinc-800 via-cyan-800 to-green-400 p-2 px-4 shadow">
								<p>{tasks[0].title}</p>
								<p className="font-bold text-zinc-800">{tasks[0].duration}</p>
							</div>

							{tasks.length > 1 && (
								<div className="mx-2 flex justify-between border-l-2 border-zinc-600 px-2">
									<p className="text-sm text-zinc-400">Break</p>{" "}
									<p className="text-sm text-zinc-400">5</p>
								</div>
							)}

							{tasks.slice(1).map((task) => {
								return (
									<div
										key={task.id}
										onClick={() => deleteTask(task.id)}
										className="flex cursor-pointer justify-between rounded-md border border-zinc-600 bg-zinc-700 bg-gradient-to-r from-zinc-800 to-zinc-600 p-2 px-4 shadow">
										<p>{task.title}</p>
										<p>{task.duration}</p>
									</div>
								);
							})}
						</div>
					</>
				) : (
					<p className="mb-1 text-zinc-400">Add some tasks :)</p>
				)}

				{isSubmitting && (
					<div className="mt-2 flex items-center justify-between gap-x-2 rounded-md border border-zinc-600 bg-zinc-900 bg-gradient-to-r p-2 px-4 shadow">
						<p className="text-zinc-400">
							{todoFetcher.submission.formData.get("task") as string}
						</p>
						<div role="status">
							<svg
								aria-hidden="true"
								className="-mr-2 h-5 w-5 animate-spin fill-white text-zinc-700 dark:text-zinc-700"
								viewBox="0 0 100 101"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path
									d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
									fill="currentColor"
								/>
								<path
									d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
									fill="currentFill"
								/>
							</svg>
							<span className="sr-only">Loading...</span>
						</div>
					</div>
				)}

				<todoFetcher.Form
					ref={inputRef}
					className="mt-4 flex items-center"
					method="post">
					<input
						type="text"
						name="task"
						min={1}
						max={50}
						autoComplete="off"
						placeholder="e.g. Reply to John's email"
						className="w-full min-w-0 rounded-bl-md rounded-tl-md  border border-zinc-600 bg-zinc-800 px-4 py-2 shadow-lg transition-colors focus-visible:bg-zinc-900 focus-visible:outline-none"
					/>
					<button
						type="submit"
						className="rounded-br-md rounded-tr-md border border-zinc-600 bg-zinc-600 p-2 shadow-lg transition-colors hover:border-zinc-500 hover:bg-zinc-500">
						<Plus />
					</button>
				</todoFetcher.Form>

				{!data?.ok && (
					<p className="mt-2 text-sm text-red-400">
						{data?.error.issues[0].message}
					</p>
				)}
			</div>
			<div className="border-1 rounded-lg border border-zinc-700 bg-zinc-800 p-4 shadow">
				<h2 className="text-xl text-zinc-200">Status</h2>
			</div>
		</div>
	);
}
