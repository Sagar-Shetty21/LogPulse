import React from 'react'

const StatsCards = () => {
    return (
        <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-5 overflow-hidden bg-white rounded-lg shadow">
                <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 bg-indigo-500 rounded-md">
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            ></path>
                        </svg>
                    </div>
                    <div className="flex-1 w-0 ml-5">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                Total Errors
                            </dt>
                            <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">
                                    1,482
                                </div>
                                <div className="flex items-baseline ml-2 text-sm font-semibold text-green-600">
                                    <span>↓ 14%</span>
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>

            <div className="p-5 overflow-hidden bg-white rounded-lg shadow">
                <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 bg-blue-500 rounded-md">
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                            ></path>
                        </svg>
                    </div>
                    <div className="flex-1 w-0 ml-5">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                Avg. Response Time
                            </dt>
                            <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">
                                    432ms
                                </div>
                                <div className="flex items-baseline ml-2 text-sm font-semibold text-red-600">
                                    <span>↑ 8%</span>
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>

            <div className="p-5 overflow-hidden bg-white rounded-lg shadow">
                <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 bg-yellow-500 rounded-md">
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            ></path>
                        </svg>
                    </div>
                    <div className="flex-1 w-0 ml-5">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                Request Rate
                            </dt>
                            <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">
                                    2.4k/min
                                </div>
                                <div className="flex items-baseline ml-2 text-sm font-semibold text-green-600">
                                    <span>↑ 12%</span>
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>

            <div className="p-5 overflow-hidden bg-white rounded-lg shadow">
                <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 bg-green-500 rounded-md">
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            ></path>
                        </svg>
                    </div>
                    <div className="flex-1 w-0 ml-5">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                Success Rate
                            </dt>
                            <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">
                                    98.3%
                                </div>
                                <div className="flex items-baseline ml-2 text-sm font-semibold text-green-600">
                                    <span>↑ 3%</span>
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatsCards