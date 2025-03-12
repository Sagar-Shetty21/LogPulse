"use client";

import LogsDataTable from "@/components/LogsDataTable";
import Navbar from "@/components/Navbar";
import StatsCards from "@/components/StatsCards";
import { useAuth } from "@/context/AuthContext";
import { FileUp, Filter, Search } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function App() {
    const { user, signOut } = useAuth()
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('logFile', file);

        setIsUploading(true);
        const toastId = toast.loading('Uploading log file...');

        try {
            const response = await fetch('/api/upload-logs', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const { jobId } = await response.json();
            toast.success('Log file uploaded successfully', { id: toastId });
            console.log('Upload successful. Job ID:', jobId);
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Failed to upload log file', { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar avatar={user?.user_metadata.avatar_url}/>

            {/* Main Content */}
            <main className="py-6">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                                Log Analytics Dashboard
                            </h2>
                        </div>
                        <div className="flex mt-4 md:mt-0 md:ml-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search logs..."
                                    className="w-full px-4 py-2 pl-10 text-sm border rounded-md text-black border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                                <Search
                                    size={16}
                                    className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                                />
                            </div>
                            <button className="inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <Filter size={16} className="mr-2" />
                                Filter
                            </button>
                            <label
                                htmlFor="file-upload"
                                className={`inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-white border border-transparent rounded-md shadow-sm cursor-pointer ${
                                    isUploading 
                                        ? 'bg-green-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                            >
                                <FileUp size={16} className={`mr-2 ${isUploading ? 'animate-pulse' : ''}`} />
                                {isUploading ? 'Uploading...' : 'Upload Log'}
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept=".log"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    disabled={isUploading}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <StatsCards />

                    {/* Tabs and Table */}
                    <LogsDataTable />
                </div>
            </main>
        </div>
    );
}
