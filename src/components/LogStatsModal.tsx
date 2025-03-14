import React, { useState } from "react";
import {
    X,
    AlertTriangle,
    FileText,
    Clock,
    User,
    Server,
    Tag,
} from "lucide-react";
import { LogStatItem } from "@/types/log-stat-item";

type LogStatPopupProps = {
    data: LogStatItem;
    onClose: () => void;
};

const LogStatsModal: React.FC<LogStatPopupProps> = ({ data, onClose }) => {
    const [activeTab, setActiveTab] = useState<
        "overview" | "errors" | "keywords"
    >("overview");

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString();
        } catch {
            return dateString;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "error":
            case "failed":
                return "bg-red-100 text-red-800";
            case "processing":
                return "bg-blue-100 text-blue-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-screen overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Log Statistics
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-auto max-h-[calc(100vh-12rem)]">
                    {/* Tabs */}
                    <div className="px-6 pt-4 border-b">
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setActiveTab("overview")}
                                className={`pb-4 px-1 ${
                                    activeTab === "overview"
                                        ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab("errors")}
                                className={`pb-4 px-1 flex items-center ${
                                    activeTab === "errors"
                                        ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                Errors
                                {data.error_count > 0 && (
                                    <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                        {data.error_count}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab("keywords")}
                                className={`pb-4 px-1 flex items-center ${
                                    activeTab === "keywords"
                                        ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                Keywords
                                {data.keywords.length > 0 && (
                                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                        {data.keywords.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Tab content */}
                    <div className="p-6">
                        {activeTab === "overview" && (
                            <div className="space-y-6">
                                {/* Status and meta */}
                                <div className="flex flex-col md:flex-row md:justify-between mb-6 gap-4">
                                    <div>
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                                data.status
                                            )}`}
                                        >
                                            {data.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500 flex items-center gap-1">
                                        <Clock size={16} />
                                        <span>
                                            Processed:{" "}
                                            {formatDate(data.processed_at)}
                                        </span>
                                    </div>
                                </div>

                                {/* Details grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <FileText className="w-5 h-5 text-gray-400 mr-2 mt-1" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">
                                                    File ID
                                                </p>
                                                <p className="text-gray-900 font-mono">
                                                    {data.file_id}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <Server className="w-5 h-5 text-gray-400 mr-2 mt-1" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">
                                                    Job ID
                                                </p>
                                                <p className="text-gray-900 font-mono">
                                                    {data.job_id}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <User className="w-5 h-5 text-gray-400 mr-2 mt-1" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">
                                                    User ID
                                                </p>
                                                <p className="text-gray-900 font-mono">
                                                    {data.user_id}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <Clock className="w-5 h-5 text-gray-400 mr-2 mt-1" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">
                                                    Job Created
                                                </p>
                                                <p className="text-gray-900">
                                                    {formatDate(
                                                        data.job_created_at
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <Tag className="w-5 h-5 text-gray-400 mr-2 mt-1" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">
                                                    Total Lines
                                                </p>
                                                <p className="text-gray-900">
                                                    {data.total_lines.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <AlertTriangle className="w-5 h-5 text-gray-400 mr-2 mt-1" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">
                                                    Error Count
                                                </p>
                                                <p
                                                    className={
                                                        data.error_count > 0
                                                            ? "text-red-600 font-medium"
                                                            : "text-green-600"
                                                    }
                                                >
                                                    {data.error_count.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* IP Addresses */}
                                {data.ips.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-sm font-medium text-gray-500 mb-3">
                                            IP Addresses
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {data.ips.map((ip, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800"
                                                >
                                                    {ip}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "errors" && (
                            <div>
                                {data.errors.length > 0 ? (
                                    <div className="space-y-4">
                                        {data.errors.map((error, index) => (
                                            <div
                                                key={index}
                                                className="bg-red-50 border border-red-200 rounded-lg p-4"
                                            >
                                                <div className="flex justify-between">
                                                    <p className="font-medium text-red-800">
                                                        {error.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatDate(
                                                            error.timestamp
                                                        )}
                                                    </p>
                                                </div>
                                                {error.details && (
                                                    <div className="mt-2">
                                                        <pre className="text-xs bg-white p-2 rounded border border-red-100 overflow-x-auto">
                                                            {JSON.stringify(
                                                                error.details,
                                                                null,
                                                                2
                                                            )}
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                                            No errors found
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            This log processed successfully
                                            without errors.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "keywords" && (
                            <div>
                                {data.keywords.length > 0 ? (
                                    <div className="space-y-4">
                                        {data.keywords.map((keyword, index) => (
                                            <div
                                                key={index}
                                                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                                            >
                                                <div className="flex justify-between">
                                                    <p className="font-medium text-blue-800">
                                                        {keyword.keyword}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatDate(
                                                            keyword.timestamp
                                                        )}
                                                    </p>
                                                </div>
                                                {keyword.details && (
                                                    <div className="mt-2">
                                                        <pre className="text-xs bg-white p-2 rounded border border-blue-100 overflow-x-auto">
                                                            {JSON.stringify(
                                                                keyword.details,
                                                                null,
                                                                2
                                                            )}
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                            />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                                            No keywords found
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            No keywords were detected in this
                                            log.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t">
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogStatsModal;
