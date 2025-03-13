export interface LogStatItem {
    id: string;
    file_id: string;
    job_id: string;
    job_created_at: string;
    processed_at: string;
    status: string;
    user_id: string;
    total_lines: number;
    error_count: number;
    errors: {
        details: JSON;
        message: string;
        timestamp: string;
    }[];
    ips: string[];
    keywords: {
        details: JSON;
        keyword: string;
        timestamp: string;
    }[];
}
