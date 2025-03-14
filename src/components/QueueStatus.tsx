import React from "react";
import { X, Clock, Activity, CheckCircle, AlertTriangle } from "lucide-react";

type QueueStatusProps = {
    data: {
        waiting: number;
        active: number;
        completed: number;
        failed: number;
    };
    onClose: () => void;
};

const QueueStatus: React.FC<QueueStatusProps> = ({ data, onClose }) => {
    const totalJobs = data.waiting + data.active + data.completed + data.failed;

    const getPercentage = (value: number) => {
        return totalJobs > 0 ? Math.round((value / totalJobs) * 100) : 0;
    };

    return (
        <div className="flex items-center justify-center p-4 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Queue Status
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Progress bar */}
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="flex h-full">
                            <div
                                className="bg-blue-500"
                                style={{
                                    width: `${getPercentage(data.waiting)}%`,
                                }}
                                title={`Waiting: ${data.waiting}`}
                            />
                            <div
                                className="bg-amber-500"
                                style={{
                                    width: `${getPercentage(data.active)}%`,
                                }}
                                title={`Active: ${data.active}`}
                            />
                            <div
                                className="bg-green-500"
                                style={{
                                    width: `${getPercentage(data.completed)}%`,
                                }}
                                title={`Completed: ${data.completed}`}
                            />
                            <div
                                className="bg-red-500"
                                style={{
                                    width: `${getPercentage(data.failed)}%`,
                                }}
                                title={`Failed: ${data.failed}`}
                            />
                        </div>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex items-center">
                                <Clock
                                    className="text-blue-500 mr-2"
                                    size={20}
                                />
                                <span className="text-sm font-medium text-blue-800">
                                    Waiting
                                </span>
                            </div>
                            <div className="mt-2 flex justify-between items-baseline">
                                <span className="text-2xl font-bold text-blue-700">
                                    {data.waiting}
                                </span>
                                <span className="text-sm text-blue-600">
                                    {getPercentage(data.waiting)}%
                                </span>
                            </div>
                        </div>

                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                            <div className="flex items-center">
                                <Activity
                                    className="text-amber-500 mr-2"
                                    size={20}
                                />
                                <span className="text-sm font-medium text-amber-800">
                                    Active
                                </span>
                            </div>
                            <div className="mt-2 flex justify-between items-baseline">
                                <span className="text-2xl font-bold text-amber-700">
                                    {data.active}
                                </span>
                                <span className="text-sm text-amber-600">
                                    {getPercentage(data.active)}%
                                </span>
                            </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <div className="flex items-center">
                                <CheckCircle
                                    className="text-green-500 mr-2"
                                    size={20}
                                />
                                <span className="text-sm font-medium text-green-800">
                                    Completed
                                </span>
                            </div>
                            <div className="mt-2 flex justify-between items-baseline">
                                <span className="text-2xl font-bold text-green-700">
                                    {data.completed}
                                </span>
                                <span className="text-sm text-green-600">
                                    {getPercentage(data.completed)}%
                                </span>
                            </div>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                            <div className="flex items-center">
                                <AlertTriangle
                                    className="text-red-500 mr-2"
                                    size={20}
                                />
                                <span className="text-sm font-medium text-red-800">
                                    Failed
                                </span>
                            </div>
                            <div className="mt-2 flex justify-between items-baseline">
                                <span className="text-2xl font-bold text-red-700">
                                    {data.failed}
                                </span>
                                <span className="text-sm text-red-600">
                                    {getPercentage(data.failed)}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Total jobs */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-baseline">
                            <span className="text-gray-600 font-medium">
                                Total Jobs
                            </span>
                            <span className="text-xl font-bold text-gray-800">
                                {totalJobs}
                            </span>
                        </div>
                    </div>

                    {/* Close button */}
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors text-sm font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QueueStatus;
