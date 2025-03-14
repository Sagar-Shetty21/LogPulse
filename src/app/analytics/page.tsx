"use client";

import React, { useEffect, useState } from "react";
import {
    AlertCircle,
    Clock,
    FileText,
    Search,
    Server,
    Users,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { LogStatItem } from "@/types/log-stat-item";
import { formatLogStatItems, LogData } from "@/workers/logDataFormatter";

// Tabs Component Props
interface TabsProps {
    defaultValue: string;
    className?: string;
    children: React.ReactNode;
}

// TabsList Component Props
interface TabsListProps {
    children: React.ReactNode;
    activeTab?: string;
    setActiveTab?: (value: string) => void;
    className?: string;
}

// TabsTrigger Component Props
interface TabsTriggerProps {
    value: string;
    active?: boolean;
    onClick?: () => void;
    className?: string;
    children: React.ReactNode;
}

// TabsContent Component Props
interface TabsContentProps {
    value: string;
    className?: string;
    children: React.ReactNode;
}

// Card Component Props
interface CardProps {
    className?: string;
    children: React.ReactNode;
}

// CardHeader Component Props
interface CardHeaderProps {
    className?: string;
    children: React.ReactNode;
}

// CardContent Component Props
interface CardContentProps {
    className?: string;
    children: React.ReactNode;
}

// CardTitle Component Props
interface CardTitleProps {
    className?: string;
    children: React.ReactNode;
}

// Tabs Component
const Tabs: React.FC<TabsProps> = ({ defaultValue, className, children }) => {
    const [activeTab, setActiveTab] = useState(defaultValue);

    return (
        <div className={className}>
            <div className="flex flex-col h-full">
                {React.Children.map(children, (child) => {
                    if (
                        React.isValidElement(child) &&
                        child.type === TabsList
                    ) {
                        return React.cloneElement(
                            child as React.ReactElement<TabsListProps>,
                            {
                                activeTab,
                                setActiveTab,
                            }
                        );
                    }
                    if (
                        React.isValidElement(child) &&
                        child.type === TabsContent
                    ) {
                        return (child as React.ReactElement<TabsContentProps>)
                            .props.value === activeTab
                            ? child
                            : null;
                    }
                    return child;
                })}
            </div>
        </div>
    );
};

// TabsList Component
const TabsList: React.FC<TabsListProps> = ({
    activeTab,
    setActiveTab,
    children,
    className,
}) => {
    return (
        <div className={`flex space-x-2 mb-4 ${className || ""}`}>
            {React.Children.map(children, (child) =>
                React.isValidElement(child) && child.type === TabsTrigger
                    ? React.cloneElement(
                          child as React.ReactElement<TabsTriggerProps>,
                          {
                              active:
                                  (
                                      child as React.ReactElement<TabsTriggerProps>
                                  ).props.value === activeTab,
                              onClick: () =>
                                  setActiveTab?.(
                                      (
                                          child as React.ReactElement<TabsTriggerProps>
                                      ).props.value
                                  ),
                          }
                      )
                    : child
            )}
        </div>
    );
};

// TabsTrigger Component
const TabsTrigger: React.FC<TabsTriggerProps> = ({
    value,
    active,
    onClick,
    children,
    className,
}) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-md ${
                active ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            } ${className || ""}`}
        >
            {children}
        </button>
    );
};

// TabsContent Component
const TabsContent: React.FC<TabsContentProps> = ({ value, children }) => {
    return <div className="flex-grow overflow-y-auto">{children}</div>;
};

// Card Component
const Card: React.FC<CardProps> = ({ className, children }) => {
    return (
        <div
            className={`bg-white shadow-md rounded-lg p-4 max-h-full h-full flex flex-col ${
                className || ""
            }`}
        >
            {children}
        </div>
    );
};

// CardHeader Component
const CardHeader: React.FC<CardHeaderProps> = ({ className, children }) => {
    return <div className={`pb-4 ${className || ""}`}>{children}</div>;
};

// CardContent Component
const CardContent: React.FC<CardContentProps> = ({ className, children }) => {
    return (
        <div className={`pt-4 flex-grow overflow-y-auto ${className || ""}`}>
            {children}
        </div>
    );
};

// CardTitle Component
const CardTitle: React.FC<CardTitleProps> = ({ className, children }) => {
    return (
        <h3 className={`text-lg font-semibold ${className || ""}`}>
            {children}
        </h3>
    );
};

const SkeletonLoader: React.FC = () => {
    return (
        <div className="w-full flex-grow overflow-y-auto">
            <div className="grid grid-cols-5 gap-4 mb-6">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-md rounded-lg p-4 animate-pulse"
                    >
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="w-full bg-slate-300 h-80 animate-pulse rounded"></div>
                <div className="w-full bg-slate-300 h-80 animate-pulse rounded"></div>
            </div>
        </div>
    );
};

const LogStatsDashboard: React.FC = () => {
    const [logsData, setLogsData] = useState<LogStatItem[]>([]);
    const [isFetchingData, setIsFetchingData] = useState(true);

    useEffect(() => {
        setIsFetchingData(true);
        fetch("/api/stats")
            .then((res) => res.json())
            .then((data) => setLogsData(data))
            .catch((error) => console.error("Error fetching data:", error))
            .finally(() => setIsFetchingData(false));
    }, []);

    const { logData, errorTypes, ipDistribution } =
        formatLogStatItems(logsData);

    const calculateProcessingTime = (job: LogData): number => {
        const processedTime = new Date(job.processed_at).getTime();
        const createdTime = new Date(job.job_created_at).getTime();
        return (processedTime - createdTime) / 1000;
    };

    const calculateErrorRate = (job: LogData): number => {
        return (job.error_count / job.total_lines) * 100;
    };

    const formatTimestamp = (timestamp: string): string => {
        return new Date(timestamp).toLocaleString();
    };

    // Colors for charts
    const COLORS = [
        "#0088FE",
        "#00C49F",
        "#FFBB28",
        "#FF8042",
        "#8884d8",
        "#82ca9d",
        "#ffc658",
    ];

    return (
        <div className="bg-gray-50 h-full py-3 text-gray-800 overflow-y-auto">
            <div className="h-full w-full p-4 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 flex flex-col">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Log Analytics
                    </h1>
                    <p className="text-gray-600">
                        Interactive visualization of log processing results
                    </p>
                </div>
                {isFetchingData ? (
                    <SkeletonLoader />
                ) : (
                    <Tabs
                        defaultValue="overview"
                        className="h-full w-full flex-grow overflow-y-auto flex flex-col"
                    >
                        <TabsList className="grid grid-cols-5 mb-6">
                            <TabsTrigger
                                value="overview"
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <FileText size={16} />
                                <span>Overview</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="errors"
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <AlertCircle size={16} />
                                <span>Error Analysis</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="network"
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <Server size={16} />
                                <span>Network</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="performance"
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <Clock size={16} />
                                <span>Performance</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="raw"
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <Search size={16} />
                                <span>Raw Data</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-500">
                                            Total Log Files
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {logData.length}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-500">
                                            Total Lines Processed
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {logData.reduce(
                                                (sum, job) =>
                                                    sum + job.total_lines,
                                                0
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-500">
                                            Total Errors
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-red-500">
                                            {logData.reduce(
                                                (sum, job) =>
                                                    sum + job.error_count,
                                                0
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-500">
                                            Average Error Rate
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {(
                                                (logData.reduce(
                                                    (sum, job) =>
                                                        sum +
                                                        job.error_count /
                                                            job.total_lines,
                                                    0
                                                ) /
                                                    logData.length) *
                                                100
                                            ).toFixed(2)}
                                            %
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* <Card>
                                <CardHeader>
                                    <CardTitle>Summary Statistics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            data={logData.map((job) => ({
                                                name:
                                                    job.file_id.substring(0, 12) +
                                                    "...",
                                                total: job.total_lines,
                                                errors: job.error_count,
                                                errorRate:
                                                    (job.error_count /
                                                        job.total_lines) *
                                                    100,
                                            }))}
                                            margin={{
                                                top: 20,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis
                                                yAxisId="left"
                                                orientation="left"
                                            />
                                            <YAxis
                                                yAxisId="right"
                                                orientation="right"
                                            />
                                            <Tooltip />
                                            <Legend />
                                            <Bar
                                                yAxisId="left"
                                                dataKey="total"
                                                name="Total Lines"
                                                fill="#8884d8"
                                            />
                                            <Bar
                                                yAxisId="left"
                                                dataKey="errors"
                                                name="Error Count"
                                                fill="#ff8042"
                                            />
                                            <Bar
                                                yAxisId="right"
                                                dataKey="errorRate"
                                                name="Error Rate (%)"
                                                fill="#82ca9d"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card> */}
                        </TabsContent>

                        {/* Error Analysis Tab */}
                        <TabsContent value="errors" className="space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full overflow-y-auto">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Error Type Distribution
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer
                                            width="100%"
                                            height={300}
                                            className={"mt-8"}
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={errorTypes
                                                        .sort(
                                                            (a, b) =>
                                                                b.count -
                                                                a.count
                                                        )
                                                        .slice(0, 5)}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    dataKey="count"
                                                    nameKey="name"
                                                    label
                                                >
                                                    {errorTypes
                                                        .sort(
                                                            (a, b) =>
                                                                b.count -
                                                                a.count
                                                        )
                                                        .slice(0, 5)
                                                        .map((entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    COLORS[
                                                                        index %
                                                                            COLORS.length
                                                                    ]
                                                                }
                                                            />
                                                        ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Error Details</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="overflow-x-auto h-full">
                                            <table className="min-w-full divide-y divide-gray-200 flex flex-col h-[480px]">
                                                <thead className="bg-gray-50">
                                                    <tr className="grid grid-cols-4">
                                                        <th className="col-span-2 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Error Type
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Count
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Percentage
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200 flex-grow overflow-y-auto">
                                                    {errorTypes
                                                        .sort(
                                                            (a, b) =>
                                                                b.count -
                                                                a.count
                                                        )
                                                        .map((error, index) => (
                                                            <tr
                                                                key={index}
                                                                className="grid grid-cols-4"
                                                            >
                                                                <td className="col-span-2 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                    {error.name}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {
                                                                        error.count
                                                                    }
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {(
                                                                        (error.count /
                                                                            errorTypes.reduce(
                                                                                (
                                                                                    sum,
                                                                                    e
                                                                                ) =>
                                                                                    sum +
                                                                                    e.count,
                                                                                0
                                                                            )) *
                                                                        100
                                                                    ).toFixed(
                                                                        2
                                                                    )}
                                                                    %
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Network Tab */}
                        <TabsContent value="network" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        IP Address Distribution
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div>
                                            <ResponsiveContainer
                                                width="100%"
                                                height={300}
                                                className={"mt-8"}
                                            >
                                                <PieChart>
                                                    <Pie
                                                        data={ipDistribution
                                                            .sort(
                                                                (a, b) =>
                                                                    b.count -
                                                                    a.count
                                                            )
                                                            .slice(0, 5)}
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={100}
                                                        fill="#8884d8"
                                                        dataKey="count"
                                                        nameKey="name"
                                                        label
                                                    >
                                                        {ipDistribution
                                                            .sort(
                                                                (a, b) =>
                                                                    b.count -
                                                                    a.count
                                                            )
                                                            .slice(0, 5)
                                                            .map(
                                                                (
                                                                    entry,
                                                                    index
                                                                ) => (
                                                                    <Cell
                                                                        key={`cell-${index}`}
                                                                        fill={
                                                                            COLORS[
                                                                                index %
                                                                                    COLORS.length
                                                                            ]
                                                                        }
                                                                    />
                                                                )
                                                            )}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="h-full">
                                            <table className="min-w-full divide-y divide-gray-200 flex flex-col h-[480px]">
                                                <thead className="bg-gray-50">
                                                    <tr className="grid grid-cols-3">
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            IP Range
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Count
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Percentage
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200 flex-grow overflow-y-auto">
                                                    {ipDistribution
                                                        .sort(
                                                            (a, b) =>
                                                                b.count -
                                                                a.count
                                                        )
                                                        .slice(0, 100)
                                                        .map((ip, index) => (
                                                            <tr
                                                                key={index}
                                                                className="grid grid-cols-3"
                                                            >
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                    {ip.name}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {ip.count}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {(
                                                                        (ip.count /
                                                                            ipDistribution.reduce(
                                                                                (
                                                                                    sum,
                                                                                    i
                                                                                ) =>
                                                                                    sum +
                                                                                    i.count,
                                                                                0
                                                                            )) *
                                                                        100
                                                                    ).toFixed(
                                                                        2
                                                                    )}
                                                                    %
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Performance Tab */}
                        <TabsContent value="performance" className="space-y-4">
                            {/* <Card>
                                <CardHeader>
                                    <CardTitle>Processing Timeline</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            data={logData.map((job) => ({
                                                name:
                                                    job.file_id.substring(0, 12) +
                                                    "...",
                                                time: parseFloat(
                                                    calculateProcessingTime(
                                                        job
                                                    ).toString()
                                                ),
                                                linesPerSec:
                                                    job.total_lines /
                                                    parseFloat(
                                                        calculateProcessingTime(
                                                            job
                                                        ).toString()
                                                    ),
                                            }))}
                                            margin={{
                                                top: 20,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis
                                                yAxisId="left"
                                                orientation="left"
                                            />
                                            <YAxis
                                                yAxisId="right"
                                                orientation="right"
                                            />
                                            <Tooltip />
                                            <Legend />
                                            <Bar
                                                yAxisId="left"
                                                dataKey="time"
                                                name="Processing Time (sec)"
                                                fill="#8884d8"
                                            />
                                            <Bar
                                                yAxisId="right"
                                                dataKey="linesPerSec"
                                                name="Lines/Second"
                                                fill="#82ca9d"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card> */}

                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Processing Performance
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto h-full">
                                        <table className="h-full min-w-full divide-y divide-gray-200 flex flex-col">
                                            <thead className="bg-gray-50">
                                                <tr className="grid grid-cols-4">
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        File ID
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Processing Time (sec)
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Lines/Second
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Error Rate
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200 flex-grow overflow-y-auto">
                                                {logData.map((job, index) => {
                                                    const processingTime =
                                                        calculateProcessingTime(
                                                            job
                                                        );
                                                    const linesPerSecond = (
                                                        job.total_lines /
                                                        processingTime
                                                    ).toFixed(2);
                                                    return (
                                                        <tr
                                                            key={index}
                                                            className="grid grid-cols-4"
                                                        >
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {job.file_id}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {processingTime}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {linesPerSecond}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {calculateErrorRate(
                                                                    job
                                                                )}
                                                                %
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Raw Data Tab */}
                        <TabsContent value="raw" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Raw Log Processing Data
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto h-full">
                                        <table className="h-full min-w-full divide-y divide-gray-200 flex flex-col">
                                            <thead className="bg-gray-50">
                                                <tr className="grid grid-cols-12">
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Job ID
                                                    </th>
                                                    <th className="col-span-3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        File ID
                                                    </th>
                                                    <th className="col-span-2 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Processed At
                                                    </th>
                                                    <th className="col-span-2 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Total Lines
                                                    </th>
                                                    <th className="col-span-2 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Error Count
                                                    </th>
                                                    <th className="col-span-2 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200 flex-grow overflow-y-auto">
                                                {logData.map((job, index) => (
                                                    <tr
                                                        key={index}
                                                        className="grid grid-cols-12"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {job.job_id}
                                                        </td>
                                                        <td className="col-span-3 px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {job.file_id}
                                                        </td>
                                                        <td className="col-span-2 px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {formatTimestamp(
                                                                job.processed_at
                                                            )}
                                                        </td>
                                                        <td className="col-span-2 px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {job.total_lines}
                                                        </td>
                                                        <td className="col-span-2 px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {job.error_count}
                                                        </td>
                                                        <td className="col-span-2 px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                {job.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </div>
    );
};

export default LogStatsDashboard;
