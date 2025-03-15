"use client";

import { Bell } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const { user, signOut } = useAuth();
    const pathname = usePathname();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const isAuthPage = pathname.includes("auth");

    const linkClasses = (href: string) =>
        pathname === href
            ? "px-3 py-2 text-sm font-medium text-indigo-600 rounded-md bg-indigo-50"
            : "px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50";

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (isAuthPage) {
        return null;
    }

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-xl font-bold text-indigo-600">
                                Log
                                <span className="text-indigo-600">Pulse</span>
                            </span>
                        </div>
                        <div className="hidden md:block">
                            <div className="flex items-baseline ml-10 space-x-4">
                                <Link href="/" className={linkClasses("/")}>
                                    Dashboard
                                </Link>
                                <Link
                                    href="/analytics"
                                    className={linkClasses("/analytics")}
                                >
                                    Analytics
                                </Link>
                                <a
                                    href="#"
                                    className="px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
                                >
                                    Settings
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button className="p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none">
                            <Bell size={20} />
                        </button>
                        <div
                            className="relative flex-shrink-0 ml-4"
                            ref={dropdownRef}
                        >
                            <div
                                className="relative cursor-pointer"
                                onMouseEnter={() => setShowDropdown(true)}
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                {user?.user_metadata.avatar_url ? (
                                    <Image
                                        src={user?.user_metadata.avatar_url}
                                        alt="User avatar"
                                        width={32}
                                        height={32}
                                        className="rounded-full bg-indigo-200"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-indigo-200" />
                                )}
                                <span className="absolute top-0 right-0 block w-2 h-2 bg-green-400 rounded-full"></span>
                            </div>

                            {/* Profile dropdown */}
                            {showDropdown && (
                                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-slate-100 ring-opacity-5 focus:outline-none">
                                    <div className="px-4 py-3">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {user?.user_metadata.name ||
                                                user?.user_metadata.username ||
                                                "User"}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            {user?.email ||
                                                "No email available"}
                                        </p>
                                    </div>
                                    <hr className="border-gray-200" />
                                    <button
                                        onClick={signOut}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
