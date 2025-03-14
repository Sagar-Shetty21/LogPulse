"use client";

import JobProgress from "@/components/JobProgress";
import LogsDataTable from "@/components/LogsDataTable";
import LogStatsModal from "@/components/LogStatsModal";
import QueueStatus from "@/components/QueueStatus";
import StatsCards from "@/components/StatsCards";
import { useAuth } from "@/context/AuthContext";
import { LogStatItem } from "@/types/log-stat-item";
import { FileUp, Filter, List, Search } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function App() {
    const { user, session } = useAuth();
    const [isUploading, setIsUploading] = useState(false);
    const [activeJobIds, setActiveJobIds] = useState<number[]>([]);
    const [searchLogs, setSearchLogs] = useState("");
    const [searchedLogStats, setSearchedLogStats] =
        useState<LogStatItem | null>(null);
    const [queueStatus, setQueueStatus] = useState<{
        waiting: number;
        active: number;
        completed: number;
        failed: number;
    } | null>(null);

    const removeJobTracking = (jobId: number) => {
        setActiveJobIds((prev) => prev.filter((id) => id !== jobId));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("logFile", file);

        setIsUploading(true);
        const toastId = toast.loading("Uploading log file...");

        try {
            if (!session) {
                throw new Error("No session found");
            }

            const response = await fetch("/api/upload-logs", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const { jobId } = await response.json();
            setActiveJobIds((prev) => [jobId, ...prev]);
            toast.success("Log file uploaded successfully", { id: toastId });
            console.log("Upload successful. Job ID:", jobId);
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("Failed to upload log file", { id: toastId });
        } finally {
            setIsUploading(false);
            e.target.value = "";
        }
    };

    const handleSearchLogStats = async () => {
        const jobId = Number(searchLogs);
        if (!jobId) {
            toast.error("Invalid job ID");
            return;
        }

        const toastId = toast.loading("Fetching log stats...");

        try {
            if (!session) {
                throw new Error("No session found");
            }

            const response = await fetch(`/api/stats/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch log stats");
            }

            const data = await response.json();
            setSearchedLogStats(data);
            toast.success("Log stats fetched successfully", { id: toastId });
        } catch (error) {
            console.error("Error fetching log stats:", error);
            toast.error("Failed to fetch log stats", { id: toastId });
        } finally {
            toast.dismiss(toastId); // Ensures toast is dismissed after completion
        }
    };

    const handleFetchQueueStatus = async () => {
        const toastId = toast.loading("Fetching queue status...");

        try {
            if (!session) {
                throw new Error("No session found");
            }

            const response = await fetch(`/api/queue-status`, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch queue status");
            }

            const data = await response.json();
            toast.success("Queue status fetched successfully", { id: toastId });
            setQueueStatus(data);
        } catch (error) {
            console.error("Error fetching queue status:", error);
            toast.error("Failed to fetch queue status", { id: toastId });
        } finally {
            toast.dismiss(toastId); // Ensures toast is dismissed after completion
        }
    };

    return (
        <div className="h-full overflow-y-auto bg-gray-50">
            {/* Main Content */}
            <main className="py-6">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                                Log Dashboard
                            </h2>
                        </div>
                        <div className="flex mt-4 md:mt-0 md:ml-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search logs..."
                                    value={searchLogs}
                                    onChange={(e) =>
                                        setSearchLogs(e.target.value)
                                    }
                                    className="w-full px-4 py-2 pl-10 text-sm border rounded-md text-black border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                                <Search
                                    size={16}
                                    className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                                />
                            </div>
                            {searchLogs && (
                                <button
                                    onClick={handleSearchLogStats}
                                    className="inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Search Stats
                                </button>
                            )}
                            {/* <button className="inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <Filter size={16} className="mr-2" />
                                Filter
                            </button> */}
                            <button
                                onClick={handleFetchQueueStatus}
                                className="inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <List size={16} className="mr-2" />
                                Queue Status
                            </button>
                            <label
                                htmlFor="file-upload"
                                className={`inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-white border border-transparent rounded-md shadow-sm cursor-pointer ${
                                    isUploading
                                        ? "bg-green-400 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700"
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                            >
                                <FileUp
                                    size={16}
                                    className={`mr-2 ${
                                        isUploading ? "animate-pulse" : ""
                                    }`}
                                />
                                {isUploading ? "Uploading..." : "Upload Log"}
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept=".log,.txt"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    disabled={isUploading}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center justify-center mt-4">
                        {/* Live Job Updates */}
                        <JobProgress
                            jobIds={activeJobIds}
                            removeJobTracking={removeJobTracking}
                        />

                        {/* Queue Status */}
                        {queueStatus && (
                            <QueueStatus
                                data={queueStatus}
                                onClose={() => setQueueStatus(null)}
                            />
                        )}
                    </div>

                    {/* Stats Cards */}
                    <StatsCards />

                    {/* Tabs and Table */}
                    <LogsDataTable />
                </div>
            </main>

            {/* searched Log stat modal */}
            {searchedLogStats && (
                <LogStatsModal
                    data={searchedLogStats}
                    onClose={() => setSearchedLogStats(null)}
                />
            )}
        </div>
    );
}
