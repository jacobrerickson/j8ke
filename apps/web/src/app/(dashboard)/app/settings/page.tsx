"use client";

import { useState } from "react";

export default function Settings() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // TODO: Implement profile update
            console.log("Updating profile:", { name, email });
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tw-p-8">
            <div className="tw-mx-auto tw-max-w-2xl">
                <h1 className="tw-mb-8 tw-text-2xl tw-font-bold">Settings</h1>

                <div className="tw-rounded-lg tw-bg-white tw-p-6 tw-shadow">
                    <h2 className="tw-mb-4 tw-text-lg tw-font-medium">Profile Settings</h2>

                    <form onSubmit={handleSubmit} className="tw-space-y-4">
                        <div>
                            <label htmlFor="name" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="tw-mt-1 tw-block tw-w-full tw-rounded-md tw-border tw-border-gray-300 tw-px-3 tw-py-2 tw-shadow-sm focus:tw-border-blue-500 focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500"
                                placeholder="Your name"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="tw-mt-1 tw-block tw-w-full tw-rounded-md tw-border tw-border-gray-300 tw-px-3 tw-py-2 tw-shadow-sm focus:tw-border-blue-500 focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500"
                                placeholder="your.email@example.com"
                            />
                        </div>

                        <div className="tw-pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="tw-rounded-md tw-bg-blue-600 tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-white tw-shadow-sm hover:tw-bg-blue-500 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-600 focus:tw-ring-offset-2 disabled:tw-cursor-not-allowed disabled:tw-opacity-50"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 