"use client";

import { useState } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";

const initialTasks = [
    { id: 1, title: "Complete project proposal", completed: false },
    { id: 2, title: "Review client feedback", completed: true },
    { id: 3, title: "Update documentation", completed: false },
    { id: 4, title: "Schedule team meeting", completed: false },
];

export default function Tasks() {
    const [tasks, setTasks] = useState(initialTasks);

    const toggleTask = (taskId: number) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };

    return (
        <div className="tw-p-8">
            <div className="tw-mx-auto tw-max-w-3xl">
                <div className="tw-mb-8">
                    <h1 className="tw-text-2xl tw-font-bold tw-tracking-tight">Tasks</h1>
                    <p className="tw-mt-2 tw-text-gray-600">Manage and track your tasks</p>
                </div>

                <div className="tw-rounded-lg tw-bg-white tw-shadow-sm">
                    <ul className="tw-divide-y tw-divide-gray-200">
                        {tasks.map((task) => (
                            <li key={task.id} className="tw-p-4">
                                <div className="tw-flex tw-items-center tw-gap-4">
                                    <button
                                        onClick={() => toggleTask(task.id)}
                                        className={`tw-flex tw-h-6 tw-w-6 tw-items-center tw-justify-center tw-rounded-full tw-border ${task.completed
                                                ? "tw-border-blue-600 tw-bg-blue-600 tw-text-white"
                                                : "tw-border-gray-300 hover:tw-border-blue-600"
                                            }`}
                                    >
                                        {task.completed && <CheckIcon className="tw-h-4 tw-w-4" />}
                                    </button>
                                    <span
                                        className={`tw-flex-1 ${task.completed ? "tw-text-gray-500 tw-line-through" : "tw-text-gray-900"
                                            }`}
                                    >
                                        {task.title}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    type="button"
                    className="tw-mt-6 tw-flex tw-w-full tw-items-center tw-justify-center tw-rounded-lg tw-border tw-border-dashed tw-border-gray-300 tw-px-4 tw-py-2.5 tw-text-sm tw-font-medium tw-text-gray-900 hover:tw-border-gray-400 hover:tw-bg-gray-50"
                >
                    Add new task
                </button>
            </div>
        </div>
    );
} 