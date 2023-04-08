import { Plus } from "iconoir-react";
import { useState } from "react";
import useLocalStorage from "use-local-storage";

type Task = {
	id: number;
	title: string;
	duration: number;
};

export default function Index() {
	const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
	const [inputValue, setInputValue] = useState("");

	const addTask = () => {
		if (inputValue.trim().length === 0) return;

		const newTask = {
			id: tasks.length + 1,
			title: inputValue,
			duration: 10,
		};
		setTasks([...tasks, newTask]);

		setInputValue("");
	};

	const deleteTask = (id: number) => {
		setTasks(tasks.filter((task) => task.id !== id));
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

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
								<p>{tasks[0].duration}</p>
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
					<p className="text-zinc-400">Add some tasks :)</p>
				)}
				<div className="mt-4 flex items-center">
					<input
						type="text"
						name="task"
						value={inputValue}
						onChange={handleInputChange}
						placeholder="e.g. Reply to John's email"
						className="w-full min-w-0 rounded-tl-md rounded-bl-md  border border-zinc-600 bg-zinc-800 px-4 py-2 shadow-lg transition-colors focus-visible:bg-zinc-900 focus-visible:outline-none"
					/>
					<button
						onClick={addTask}
						className="rounded-tr-md rounded-br-md border border-zinc-600 bg-zinc-600 p-2 shadow-lg transition-colors hover:border-zinc-500 hover:bg-zinc-500">
						<Plus />
					</button>
				</div>
			</div>
			<div className="border-1 rounded-lg border border-zinc-700 bg-zinc-800 p-4 shadow">
				<h2 className="text-xl text-zinc-200">Status</h2>
			</div>
		</div>
	);
}
