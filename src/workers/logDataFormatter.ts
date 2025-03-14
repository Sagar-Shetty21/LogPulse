import { LogStatItem } from "@/types/log-stat-item";

export interface LogData {
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
export interface ErrorType {
    name: string;
    count: number;
}

export interface IPDistribution {
    name: string;
    count: number;
}

/**
 * Processes an array of LogStatItem objects and returns organized log data
 * @param logStatItems Array of LogStatItem objects to process
 * @returns Object containing logData, errorTypes, and ipDistribution
 */
export function formatLogStatItems(logStatItems: LogStatItem[]) {
    // Extract basic log data
    const logData: LogData[] = logStatItems?.map((item) => ({
        id: item.id,
        job_id: Number(item.job_id), // Converting to number as per interface definition
        file_id: item.file_id,
        processed_at: item.processed_at,
        total_lines: item.total_lines,
        error_count: item.error_count,
        status: item.status,
        job_created_at: item.job_created_at,
        user_id: item.user_id,
    }));

    // Process error types
    const errorCountMap = new Map<string, number>();

    logStatItems.forEach((item) => {
        item.errors.forEach((error) => {
            const errorName = error.message;
            errorCountMap.set(
                errorName,
                (errorCountMap.get(errorName) || 0) + 1
            );
        });
    });

    const errorTypes: ErrorType[] = Array.from(errorCountMap.entries()).map(
        ([name, count]) => ({
            name,
            count,
        })
    );

    // Process IP distribution
    const ipCountMap = new Map<string, number>();

    logStatItems.forEach((item) => {
        item.ips.forEach((ip) => {
            ipCountMap.set(ip, (ipCountMap.get(ip) || 0) + 1);
        });
    });

    const ipDistribution: IPDistribution[] = Array.from(
        ipCountMap.entries()
    ).map(([name, count]) => ({
        name,
        count,
    }));

    return {
        logData,
        errorTypes,
        ipDistribution,
    };
}
