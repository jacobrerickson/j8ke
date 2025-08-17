"use client";

import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/20/solid";

export default function Dashboard() {
    return (
        <div className="tw-p-8">
            {/* Stats Overview */}
            <div className="tw-grid tw-gap-6 sm:tw-grid-cols-2 lg:tw-grid-cols-2">
                <div className="tw-rounded-lg tw-bg-white tw-p-6 tw-shadow-sm">
                    <div className="tw-flex tw-items-center tw-justify-between">
                        <div>
                            <h3 className="tw-text-sm tw-font-medium tw-text-gray-500">Customers</h3>
                            <div className="tw-mt-1 tw-flex tw-items-baseline">
                                <p className="tw-text-2xl tw-font-semibold tw-text-gray-900">3,782</p>
                                <span className="tw-ml-2 tw-flex tw-items-baseline tw-text-sm tw-font-semibold tw-text-green-600">
                                    <ArrowUpIcon className="tw-h-4 tw-w-4 tw-shrink-0" />
                                    11.01%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="tw-rounded-lg tw-bg-white tw-p-6 tw-shadow-sm">
                    <div className="tw-flex tw-items-center tw-justify-between">
                        <div>
                            <h3 className="tw-text-sm tw-font-medium tw-text-gray-500">Orders</h3>
                            <div className="tw-mt-1 tw-flex tw-items-baseline">
                                <p className="tw-text-2xl tw-font-semibold tw-text-gray-900">5,359</p>
                                <span className="tw-ml-2 tw-flex tw-items-baseline tw-text-sm tw-font-semibold tw-text-red-600">
                                    <ArrowDownIcon className="tw-h-4 tw-w-4 tw-shrink-0" />
                                    9.05%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Monthly Sales Chart */}
            <div className="tw-mt-8 tw-rounded-lg tw-bg-white tw-p-6 tw-shadow-sm">
                <div className="tw-flex tw-items-center tw-justify-between">
                    <h2 className="tw-text-lg tw-font-medium tw-text-gray-900">Monthly Sales</h2>
                    <button className="tw-rounded-md tw-bg-white tw-p-2 tw-text-gray-400 hover:tw-text-gray-500">
                        {/* Three dots menu icon */}
                        <svg className="tw-h-5 tw-w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                    </button>
                </div>
                <div className="tw-mt-4 tw-h-[300px]">
                    {/* Chart will go here - for now showing placeholder bars */}
                    <div className="tw-flex tw-h-full tw-items-end tw-space-x-4">
                        {[40, 70, 35, 50, 35, 35, 50, 25, 35, 65, 45, 25].map((height, i) => (
                            <div
                                key={i}
                                className="tw-w-full tw-bg-blue-500 tw-transition-all hover:tw-bg-blue-600"
                                style={{ height: `${height}%` }}
                            ></div>
                        ))}
                    </div>
                    <div className="tw-mt-4 tw-grid tw-grid-cols-12 tw-gap-4 tw-text-xs tw-text-gray-500">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                            <div key={month} className="tw-text-center">{month}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Monthly Target */}
            <div className="tw-mt-8 tw-rounded-lg tw-bg-white tw-p-6 tw-shadow-sm">
                <div className="tw-flex tw-items-center tw-justify-between">
                    <div>
                        <h2 className="tw-text-lg tw-font-medium tw-text-gray-900">Monthly Target</h2>
                        <p className="tw-mt-1 tw-text-sm tw-text-gray-500">Target you&apos;ve set for each month</p>
                    </div>
                    <div className="tw-relative tw-h-32 tw-w-32">
                        {/* Circular progress indicator */}
                        <svg className="tw-h-full tw-w-full" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#eee"
                                strokeWidth="3"
                            />
                            <path
                                d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#4F46E5"
                                strokeWidth="3"
                                strokeDasharray="75, 100"
                            />
                            <text x="18" y="20.35" className="tw-fill-gray-900 tw-text-lg tw-font-medium" textAnchor="middle">
                                75.55%
                            </text>
                        </svg>
                    </div>
                </div>
                <div className="tw-mt-4">
                    <div className="tw-grid tw-grid-cols-3 tw-gap-4 tw-text-center">
                        <div>
                            <p className="tw-text-sm tw-font-medium tw-text-gray-500">Target</p>
                            <p className="tw-mt-1 tw-text-lg tw-font-semibold tw-text-gray-900">$20K</p>
                        </div>
                        <div>
                            <p className="tw-text-sm tw-font-medium tw-text-gray-500">Revenue</p>
                            <p className="tw-mt-1 tw-text-lg tw-font-semibold tw-text-gray-900">$20K</p>
                        </div>
                        <div>
                            <p className="tw-text-sm tw-font-medium tw-text-gray-500">Today</p>
                            <p className="tw-mt-1 tw-text-lg tw-font-semibold tw-text-gray-900">$20K</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}