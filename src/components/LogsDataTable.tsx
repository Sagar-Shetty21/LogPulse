import { ExternalLink, MoreHorizontal } from 'lucide-react';
import React, { useState } from 'react'

const LogsDataTable = () => {
    const [activeTab, setActiveTab] = useState("errors");

    // Sample data for demonstration
    const statsData = {
        errors: [
            {
                id: 1,
                timestamp: "2025-03-11T09:24:15",
                level: "ERROR",
                message: "Failed to connect to database",
                source: "api-server",
                count: 23,
            },
            {
                id: 2,
                timestamp: "2025-03-11T08:45:32",
                level: "ERROR",
                message: "Authentication token expired",
                source: "auth-service",
                count: 156,
            },
            {
                id: 3,
                timestamp: "2025-03-11T07:12:08",
                level: "ERROR",
                message: "Invalid API request format",
                source: "gateway",
                count: 87,
            },
            {
                id: 4,
                timestamp: "2025-03-10T22:14:53",
                level: "ERROR",
                message: "Memory limit exceeded",
                source: "worker-3",
                count: 12,
            },
            {
                id: 5,
                timestamp: "2025-03-10T18:32:40",
                level: "ERROR",
                message: "Timeout during response",
                source: "api-server",
                count: 43,
            },
        ],
        keywords: [
            { id: 1, keyword: "timeout", occurrences: 428, trend: "+15%" },
            {
                id: 2,
                keyword: "connection refused",
                occurrences: 256,
                trend: "-8%",
            },
            {
                id: 3,
                keyword: "authentication failed",
                occurrences: 187,
                trend: "+32%",
            },
            { id: 4, keyword: "memory limit", occurrences: 124, trend: "+5%" },
            {
                id: 5,
                keyword: "database error",
                occurrences: 98,
                trend: "-12%",
            },
        ],
        ips: [
            { id: 1, ip: "192.168.1.105", requests: 12543, status: "normal" },
            { id: 2, ip: "10.45.12.88", requests: 8721, status: "warning" },
            { id: 3, ip: "172.16.254.1", requests: 5432, status: "blocked" },
            { id: 4, ip: "192.168.0.15", requests: 4210, status: "normal" },
            { id: 5, ip: "10.0.0.142", requests: 3854, status: "normal" },
        ],
    };

    return (
        <div className="mt-8">
            <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                    Select a tab
                </label>
                <select
                    id="tabs"
                    name="tabs"
                    className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                >
                    <option value="errors">Errors</option>
                    <option value="keywords">Keywords</option>
                    <option value="ips">IPs</option>
                </select>
            </div>
            <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                    <nav
                        className="flex -mb-px space-x-8"
                        aria-label="Tabs"
                    >
                        <button
                            onClick={() => setActiveTab("errors")}
                            className={`${
                                activeTab === "errors"
                                    ? "border-indigo-500 text-indigo-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Errors
                        </button>
                        <button
                            onClick={() => setActiveTab("keywords")}
                            className={`${
                                activeTab === "keywords"
                                    ? "border-indigo-500 text-indigo-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Keywords
                        </button>
                        <button
                            onClick={() => setActiveTab("ips")}
                            className={`${
                                activeTab === "ips"
                                    ? "border-indigo-500 text-indigo-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            IPs
                        </button>
                    </nav>
                </div>
            </div>

            {/* Table Content */}
            <div className="mt-4">
                <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                    {activeTab === "errors" && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                        >
                                            Timestamp
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                        >
                                            Level
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                        >
                                            Message
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                        >
                                            Source
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                        >
                                            Count
                                        </th>
                                        <th
                                            scope="col"
                                            className="relative px-6 py-3"
                                        >
                                            <span className="sr-only">
                                                Actions
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {statsData.errors.map(
                                        (error) => (
                                            <tr
                                                key={error.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                    {new Date(error.timestamp).toLocaleString("en-GB", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        second: "2-digit",
                                                        hour12: false,
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex px-2 text-xs font-semibold leading-5 text-red-800 bg-red-100 rounded-full">
                                                        {
                                                            error.level
                                                        }
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {error.message}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                    {error.source}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                    {error.count}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                                    <button className="text-indigo-600 hover:text-indigo-900">
                                                        <ExternalLink
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === "keywords" && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                        >
                                            Keyword
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                        >
                                            Occurrences
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                        >
                                            Trend
                                        </th>
                                        <th
                                            scope="col"
                                            className="relative px-6 py-3"
                                        >
                                            <span className="sr-only">
                                                Actions
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {statsData.keywords.map(
                                        (keyword) => (
                                            <tr
                                                key={keyword.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                    {
                                                        keyword.keyword
                                                    }
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                    {keyword.occurrences.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                                                            keyword.trend.startsWith(
                                                                "+"
                                                            )
                                                                ? "text-red-800 bg-red-100"
                                                                : "text-green-800 bg-green-100"
                                                        }`}
                                                    >
                                                        {
                                                            keyword.trend
                                                        }
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                                    <button className="text-gray-400 hover:text-gray-500">
                                                        <MoreHorizontal
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === "ips" && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                        >
                                            IP Address
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                        >
                                            Requests
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                        >
                                            Status
                                        </th>
                                        <th
                                            scope="col"
                                            className="relative px-6 py-3"
                                        >
                                            <span className="sr-only">
                                                Actions
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {statsData.ips.map((ip) => (
                                        <tr
                                            key={ip.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                {ip.ip}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                {ip.requests.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                                                        ip.status ===
                                                        "normal"
                                                            ? "text-green-800 bg-green-100"
                                                            : ip.status ===
                                                                "warning"
                                                            ? "text-yellow-800 bg-yellow-100"
                                                            : "text-red-800 bg-red-100"
                                                    }`}
                                                >
                                                    {ip.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                                <button className="text-indigo-600 hover:text-indigo-900">
                                                    Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default LogsDataTable