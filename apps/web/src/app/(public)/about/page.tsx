"use client";

export default function About() {
    return (
        <div className="tw-py-24 sm:tw-py-32">
            <div className="tw-mx-auto tw-max-w-7xl tw-px-6 lg:tw-px-8">
                <div className="tw-mx-auto tw-max-w-2xl">
                    <h1 className="tw-text-4xl tw-font-bold tw-tracking-tight tw-text-gray-900 sm:tw-text-6xl">
                        About Template
                    </h1>
                    <p className="tw-mt-6 tw-text-lg tw-leading-8 tw-text-gray-600">
                        A modern, full-stack application template built with cutting-edge technologies.
                    </p>

                    <div className="tw-mt-16 tw-space-y-16">
                        <div>
                            <h2 className="tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900">
                                Tech Stack
                            </h2>
                            <div className="tw-mt-6 tw-space-y-4">
                                <div>
                                    <h3 className="tw-text-lg tw-font-semibold tw-text-gray-900">Frontend</h3>
                                    <ul className="tw-mt-2 tw-list-disc tw-list-inside tw-text-gray-600">
                                        <li>Next.js 14 with App Router</li>
                                        <li>TypeScript for type safety</li>
                                        <li>Tailwind CSS for styling</li>
                                        <li>Redux for state management</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="tw-text-lg tw-font-semibold tw-text-gray-900">Backend</h3>
                                    <ul className="tw-mt-2 tw-list-disc tw-list-inside tw-text-gray-600">
                                        <li>tRPC for type-safe APIs</li>
                                        <li>MongoDB for data storage</li>
                                        <li>Mongoose ODM for MongoDB</li>
                                        <li>JWT for authentication</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900">
                                Features
                            </h2>
                            <ul className="tw-mt-6 tw-space-y-2 tw-text-gray-600">
                                <li className="tw-flex tw-gap-x-3">
                                    <svg className="tw-h-6 tw-w-5 tw-flex-none tw-text-blue-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                    </svg>
                                    Authentication with email verification
                                </li>
                                <li className="tw-flex tw-gap-x-3">
                                    <svg className="tw-h-6 tw-w-5 tw-flex-none tw-text-blue-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                    </svg>
                                    Responsive design with Tailwind CSS
                                </li>
                                <li className="tw-flex tw-gap-x-3">
                                    <svg className="tw-h-6 tw-w-5 tw-flex-none tw-text-blue-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                    </svg>
                                    Type-safe API calls with tRPC
                                </li>
                                <li className="tw-flex tw-gap-x-3">
                                    <svg className="tw-h-6 tw-w-5 tw-flex-none tw-text-blue-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                    </svg>
                                    Modern dashboard interface
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 