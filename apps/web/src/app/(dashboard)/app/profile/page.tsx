"use client";

import { useAuth } from "@/hooks/use-auth";

export default function Profile() {
    const { user } = useAuth();

    return (
        <div className="tw-p-8">
            <div className="tw-mx-auto tw-max-w-3xl">
                <div className="tw-rounded-lg tw-bg-white tw-p-6 tw-shadow-sm">
                    <div className="tw-space-y-8 tw-divide-y tw-divide-gray-200">
                        {/* Profile section */}
                        <div className="tw-space-y-6">
                            <div>
                                <h3 className="tw-text-lg tw-font-medium tw-leading-6 tw-text-gray-900">Profile</h3>
                                <p className="tw-mt-1 tw-text-sm tw-text-gray-500">
                                    Manage your account settings and preferences.
                                </p>
                            </div>

                            <div className="tw-grid tw-grid-cols-1 tw-gap-y-6 sm:tw-grid-cols-6">
                                <div className="sm:tw-col-span-4">
                                    <label htmlFor="email" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                                        Email
                                    </label>
                                    <div className="tw-mt-1">
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={user?.email}
                                            disabled
                                            className="tw-block tw-w-full tw-rounded-lg tw-border-gray-300 tw-bg-gray-50 tw-px-3 tw-py-2 tw-text-gray-500 tw-shadow-sm focus:tw-border-blue-500 focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Password section */}
                        <div className="tw-pt-8">
                            <div>
                                <h3 className="tw-text-lg tw-font-medium tw-leading-6 tw-text-gray-900">Password</h3>
                                <p className="tw-mt-1 tw-text-sm tw-text-gray-500">
                                    Update your password to keep your account secure.
                                </p>
                            </div>

                            <div className="tw-mt-6">
                                <button
                                    type="button"
                                    className="tw-rounded-lg tw-bg-blue-600 tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-white hover:tw-bg-blue-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2"
                                >
                                    Change password
                                </button>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="tw-pt-8">
                            <div>
                                <h3 className="tw-text-lg tw-font-medium tw-leading-6 tw-text-red-600">Danger Zone</h3>
                                <p className="tw-mt-1 tw-text-sm tw-text-gray-500">
                                    Once you delete your account, there is no going back. Please be certain.
                                </p>
                            </div>

                            <div className="tw-mt-6">
                                <button
                                    type="button"
                                    className="tw-rounded-lg tw-bg-red-600 tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-white hover:tw-bg-red-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red-500 focus:tw-ring-offset-2"
                                >
                                    Delete account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 