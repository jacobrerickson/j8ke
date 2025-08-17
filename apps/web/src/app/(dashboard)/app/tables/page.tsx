"use client";

import Image from "next/image";

const people = [
    {
        name: "Lindsay Walton",
        title: "Front-end Developer",
        email: "lindsay.walton@example.com",
        role: "Member",
    },
    {
        name: "Courtney Henry",
        title: "Designer",
        email: "courtney.henry@example.com",
        role: "Admin",
    },
    {
        name: "Tom Cook",
        title: "Product Manager",
        email: "tom.cook@example.com",
        role: "Member",
    },
    {
        name: "Whitney Francis",
        title: "Content Specialist",
        email: "whitney.francis@example.com",
        role: "Admin",
    },
    {
        name: "Leonard Krasner",
        title: "Senior Designer",
        email: "leonard.krasner@example.com",
        role: "Member",
    },
];

export default function Tables() {
    return (
        <div className="tw-p-8">
            <div className="tw-mx-auto tw-max-w-7xl">
                <div className="tw-mb-8 sm:tw-flex sm:tw-items-center sm:tw-justify-between">
                    <div>
                        <h1 className="tw-text-2xl tw-font-bold tw-tracking-tight">Team Members</h1>
                        <p className="tw-mt-2 tw-text-gray-600">A list of all the users in your account.</p>
                    </div>
                    <div className="tw-mt-4 sm:tw-mt-0">
                        <button
                            type="button"
                            className="tw-rounded-lg tw-bg-blue-600 tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-white hover:tw-bg-blue-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2"
                        >
                            Add Member
                        </button>
                    </div>
                </div>

                <div className="tw-overflow-hidden tw-rounded-lg tw-bg-white tw-shadow-sm">
                    <div className="tw-overflow-x-auto">
                        <table className="tw-min-w-full tw-divide-y tw-divide-gray-200">
                            <thead className="tw-bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="tw-py-3.5 tw-pl-4 tw-pr-3 tw-text-left tw-text-sm tw-font-semibold tw-text-gray-900 sm:tw-pl-6"
                                    >
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="tw-px-3 tw-py-3.5 tw-text-left tw-text-sm tw-font-semibold tw-text-gray-900"
                                    >
                                        Title
                                    </th>
                                    <th
                                        scope="col"
                                        className="tw-px-3 tw-py-3.5 tw-text-left tw-text-sm tw-font-semibold tw-text-gray-900"
                                    >
                                        Email
                                    </th>
                                    <th
                                        scope="col"
                                        className="tw-px-3 tw-py-3.5 tw-text-left tw-text-sm tw-font-semibold tw-text-gray-900"
                                    >
                                        Role
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="tw-divide-y tw-divide-gray-200 tw-bg-white">
                                {people.map((person) => (
                                    <tr key={person.email}>
                                        <td className="tw-whitespace-nowrap tw-py-4 tw-pl-4 tw-pr-3 sm:tw-pl-6">
                                            <div className="tw-flex tw-items-center">
                                                <div className="tw-h-10 tw-w-10 tw-flex-shrink-0 tw-relative tw-rounded-full tw-overflow-hidden">
                                                    <Image
                                                        fill
                                                        className="tw-object-cover"
                                                        src={`https://images.unsplash.com/photo-${Math.floor(
                                                            Math.random() * 1000
                                                        )}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                                                        alt={`${person.name}'s profile picture`}
                                                        width={40}
                                                        height={40}
                                                    />
                                                </div>
                                                <div className="tw-ml-4">
                                                    <div className="tw-font-medium tw-text-gray-900">{person.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="tw-whitespace-nowrap tw-px-3 tw-py-4 tw-text-sm tw-text-gray-500">
                                            {person.title}
                                        </td>
                                        <td className="tw-whitespace-nowrap tw-px-3 tw-py-4 tw-text-sm tw-text-gray-500">
                                            {person.email}
                                        </td>
                                        <td className="tw-whitespace-nowrap tw-px-3 tw-py-4 tw-text-sm">
                                            <span
                                                className={`tw-inline-flex tw-rounded-full tw-px-2 tw-text-xs tw-font-semibold tw-leading-5 ${person.role === "Admin"
                                                    ? "tw-bg-green-100 tw-text-green-800"
                                                    : "tw-bg-gray-100 tw-text-gray-800"
                                                    }`}
                                            >
                                                {person.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}