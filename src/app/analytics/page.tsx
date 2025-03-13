"use client";

import React, { useState } from "react";
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

// Define types for log data
interface LogData {
    id: string;
    job_id: number;
    file_id: string;
    processed_at: string;
    total_lines: number;
    error_count: number;
    status: string;
    job_created_at: string;
    user_id: string;
}

// Define types for error types and IP distribution
interface ErrorType {
    name: string;
    count: number;
}

interface IPDistribution {
    name: string;
    count: number;
}

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
            <div>
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
    return <div>{children}</div>;
};

// Card Component
const Card: React.FC<CardProps> = ({ className, children }) => {
    return (
        <div className={`bg-white shadow-md rounded-lg p-4 ${className || ""}`}>
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
    return <div className={`pt-4 ${className || ""}`}>{children}</div>;
};

// CardTitle Component
const CardTitle: React.FC<CardTitleProps> = ({ className, children }) => {
    return (
        <h3 className={`text-lg font-semibold ${className || ""}`}>
            {children}
        </h3>
    );
};

const LogStatsDashboard: React.FC = () => {
    // Sample data from the CSV
    const logData: LogData[] = [
        {
            id: "a4505eb4-0c3a-400e-8f87-5849f8a01c80",
            job_id: 40,
            file_id: "log-1741861234361.log",
            processed_at: "2025-03-13 10:21:53.291+00",
            total_lines: 399,
            error_count: 90,
            status: "completed",
            job_created_at: "2025-03-13 10:20:34.843+00",
            user_id: "0c4ed813-b714-43bc-b78d-ec0413940859",
        },
        {
            id: "f4e90f93-a9ca-4930-8d03-a721dc5efa68",
            job_id: 43,
            file_id: "log-1741861789994.log",
            processed_at: "2025-03-13 10:29:51.279+00",
            total_lines: 490,
            error_count: 112,
            status: "completed",
            job_created_at: "2025-03-13 10:29:50.536+00",
            user_id: "0c4ed813-b714-43bc-b78d-ec0413940859",
        },
    ];
    const errorTypes: ErrorType[] = [
        { name: "Database Issues", count: 25 },
        { name: "File Operations", count: 22 },
        { name: "Connection Problems", count: 18 },
        { name: "Invalid Input", count: 15 },
        { name: "API Errors", count: 12 },
        { name: "Permission Issues", count: 10 },
        { name: "Configuration Problems", count: 8 },
    ];

    const ipDistribution: IPDistribution[] = [
        { name: "192.168.1.x", count: 12 },
        { name: "203.0.113.x", count: 5 },
        { name: "10.0.0.x", count: 2 },
    ];

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
        <div className="bg-gray-50 min-h-screen py-3 text-gray-800">
            <div className="w-full max-h-screen p-4 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Log Analytics
                    </h1>
                    <p className="text-gray-600">
                        Interactive visualization of log processing results
                    </p>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid grid-cols-5 mb-6">
                        <TabsTrigger
                            value="overview"
                            className="flex items-center gap-2"
                        >
                            <FileText size={16} />
                            <span>Overview</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="errors"
                            className="flex items-center gap-2"
                        >
                            <AlertCircle size={16} />
                            <span>Error Analysis</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="network"
                            className="flex items-center gap-2"
                        >
                            <Server size={16} />
                            <span>Network</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="performance"
                            className="flex items-center gap-2"
                        >
                            <Clock size={16} />
                            <span>Performance</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="raw"
                            className="flex items-center gap-2"
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
                                            (sum, job) => sum + job.total_lines,
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
                                            (sum, job) => sum + job.error_count,
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

                        <Card>
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
                        </Card>
                    </TabsContent>

                    {/* Error Analysis Tab */}
                    <TabsContent value="errors" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                                    >
                                        <PieChart>
                                            <Pie
                                                data={errorTypes}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="count"
                                                nameKey="name"
                                                label
                                            >
                                                {errorTypes.map(
                                                    (entry, index) => (
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
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Error Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {errorTypes.map(
                                                    (error, index) => (
                                                        <tr key={index}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {error.name}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {error.count}
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
                                                                ).toFixed(2)}
                                                                %
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
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
                                <CardTitle>IP Address Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div>
                                        <ResponsiveContainer
                                            width="100%"
                                            height={300}
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={ipDistribution}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    dataKey="count"
                                                    nameKey="name"
                                                    label
                                                >
                                                    {ipDistribution.map(
                                                        (entry, index) => (
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
                                    <div>
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
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
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {ipDistribution.map(
                                                    (ip, index) => (
                                                        <tr key={index}>
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
                                                                ).toFixed(2)}
                                                                %
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Performance Tab */}
                    <TabsContent value="performance" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Processing Performance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
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
                                        <tbody className="bg-white divide-y divide-gray-200">
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
                                                    <tr key={index}>
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

                        <Card>
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
                        </Card>
                    </TabsContent>

                    {/* Raw Data Tab */}
                    <TabsContent value="raw" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Raw Log Processing Data</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Job ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    File ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Processed At
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Total Lines
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Error Count
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {logData.map((job, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {job.job_id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {job.file_id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatTimestamp(
                                                            job.processed_at
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {job.total_lines}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {job.error_count}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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

                        <Card>
                            <CardHeader>
                                <CardTitle>Processing Job Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Job ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Created At
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Processed At
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Processing Time
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    User ID
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {logData.map((job, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {job.job_id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatTimestamp(
                                                            job.job_created_at
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatTimestamp(
                                                            job.processed_at
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {calculateProcessingTime(
                                                            job
                                                        )}
                                                        s
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <span className="truncate max-w-xs inline-block">
                                                            {job.user_id}
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
            </div>
        </div>
    );
};

export default LogStatsDashboard;
