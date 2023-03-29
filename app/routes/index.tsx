import { useState } from "react";

type Task = {
	id: number;
	title: string;
	duration: number;
};

export default function Index() {
	const [tasks, setTasks] = useState<Task[]>(tasksData);

	return (
		<div className="max-w-xl mx-auto flex flex-col gap-y-4 h-full justify-center">
			<div className="border bg-zinc-800 border-zinc-700 p-4 rounded-lg shadow">
				<h2 className="text-zinc-200 text-xl mb-2">Tasks</h2>
				<p className="text-sm text-zinc-400 mb-1">Current task</p>
				<div className="flex flex-col gap-y-2">
					<div
						key={tasks[0].id}
						className="bg-zinc-700 bg-gradient-to-r from-zinc-800 via-cyan-800 to-green-400 border border-zinc-600 rounded-md px-4 p-2 shadow flex justify-between">
						<p>{tasks[0].title}</p>
						<p>{tasks[0].duration}</p>
					</div>
					<div className="flex justify-between border-l-2 px-2 mx-2 border-zinc-600">
						<p className="text-sm text-zinc-400">Break</p>{" "}
						<p className="text-sm text-zinc-400">5</p>
					</div>
					{tasks.slice(1).map((task) => {
						return (
							<div
								key={task.id}
								className="bg-zinc-700 bg-gradient-to-r from-zinc-800 to-zinc-600 border border-zinc-600 rounded-md px-4 p-2 shadow flex justify-between">
								<p>{task.title}</p>
								<p>{task.duration}</p>
							</div>
						);
					})}
				</div>
				<input
					type="text"
					placeholder="e.g. Reply to John's email"
					className="bg-zinc-800 min-w-0 mt-4 w-full shadow-lg  border border-zinc-600 rounded-md px-4 p-2"
				/>
			</div>
			<div className="border border-1 bg-zinc-800 border-zinc-700 p-4 rounded-lg shadow">
				<h2 className="text-zinc-200 text-xl">Status</h2>
			</div>
		</div>
	);
}

const tasksData: Task[] = [
	{ id: 1, title: "Meeting with Doe", duration: 15 },
	{ id: 2, title: "Walk my dog", duration: 20 },
];
