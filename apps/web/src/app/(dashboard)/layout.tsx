"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
    HomeIcon,
    UserIcon,
    ClipboardDocumentListIcon,
    TableCellsIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { useEffect } from "react";
import Image from "next/image";

const navigation = {
    menu: [
        { name: "Dashboard", href: "/app/dashboard", icon: HomeIcon },
        { name: "Profile", href: "/app/profile", icon: UserIcon },
    ],
    tasks: [
        { name: "Tasks", href: "/app/tasks", icon: ClipboardDocumentListIcon },
        { name: "Tables", href: "/app/tables", icon: TableCellsIcon },
    ],
    ai: [
        { name: "Internet Search", href: "/app/ai/internet-search", icon: MagnifyingGlassIcon },
    ],
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { signOut, user, getProfile } = useAuth();

    useEffect(() => {
        const checkAuth = async () => {
            const profile = await getProfile();
            if (!profile) {
                router.push('/auth/login');
            }
        };
        checkAuth();
    }, []);

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    const NavItem = ({ item }: { item: typeof navigation.menu[0] }) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
            <li key={item.name}>
                <Link
                    href={item.href}
                    className={`tw-flex tw-items-center tw-rounded-lg tw-px-3 tw-py-2 tw-text-sm ${isActive
                        ? "tw-bg-blue-50 tw-text-blue-600"
                        : "tw-text-gray-700 hover:tw-bg-gray-50"
                        }`}
                >
                    <Icon className={`tw-h-5 tw-w-5 tw-shrink-0 ${isActive ? "tw-text-blue-600" : "tw-text-gray-400"}`} />
                    <span className="tw-ml-3">{item.name}</span>
                </Link>
            </li>
        );
    };

    return (
        <div className="tw-min-h-screen tw-bg-gray-50">
            {/* Sidebar */}
            <aside className="tw-fixed tw-left-0 tw-top-0 tw-z-40 tw-h-screen tw-w-64 tw-border-r tw-border-gray-200 tw-bg-white">
                <div className="tw-flex tw-h-full tw-flex-col">
                    {/* App Name */}
                    <div className="tw-border-b tw-border-gray-200 tw-px-6 tw-py-4">
                        <Link href="/" className="tw-flex tw-items-center">
                            <span className="tw-text-xl tw-font-semibold tw-text-blue-600">Template</span>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="tw-flex-1 tw-overflow-y-auto tw-p-4">
                        <div className="tw-space-y-8">
                            <div>
                                <h3 className="tw-px-3 tw-text-xs tw-font-semibold tw-uppercase tw-text-gray-500">Menu</h3>
                                <ul className="tw-mt-2 tw-space-y-1">
                                    {navigation.menu.map((item) => (
                                        <NavItem key={item.name} item={item} />
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="tw-px-3 tw-text-xs tw-font-semibold tw-uppercase tw-text-gray-500">Tasks</h3>
                                <ul className="tw-mt-2 tw-space-y-1">
                                    {navigation.tasks.map((item) => (
                                        <NavItem key={item.name} item={item} />
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="tw-px-3 tw-text-xs tw-font-semibold tw-uppercase tw-text-gray-500">AI Agents</h3>
                                <ul className="tw-mt-2 tw-space-y-1">
                                    {navigation.ai.map((item) => (
                                        <NavItem key={item.name} item={item} />
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* User Info and Sign Out */}
                    <div className="tw-border-t tw-border-gray-200 tw-p-4">
                        <div className="tw-flex tw-items-center tw-gap-3">
                            <div className="tw-relative tw-h-8 tw-w-8 tw-rounded-full tw-overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt="Profile"
                                    fill
                                    className="tw-object-cover"
                                />
                            </div>
                            <div className="tw-flex-1">
                                <div className="tw-text-sm tw-font-medium tw-text-gray-700">{user?.email}</div>
                                <button
                                    onClick={handleSignOut}
                                    className="tw-text-sm tw-text-gray-500 hover:tw-text-gray-700"
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="tw-ml-64 tw-min-h-screen tw-bg-gray-50">
                {children}
            </div>
        </div>
    );
}