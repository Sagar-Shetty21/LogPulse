import { useEffect, useState } from "react";

type ProgressData = {
    processedLines: number;
    errors: number;
    status: "processing" | "completed" | "error";
    errorMessage?: string;
};

type WebSocketMessage = {
    type: "progress" | "completed";
    jobId: number;
    progress?: ProgressData;
    result?: any;
};

export default function JobProgress({ jobId }: { jobId: number | null }) {
    const [progress, setProgress] = useState<ProgressData | null>(null);

    useEffect(() => {
        if (!jobId) return;
        let ws: WebSocket | null = null;
        let retryCount = 0;
        const maxRetries = 3;

        const connect = () => {
            ws = new WebSocket(`ws://${window.location.host}/api/live-stats`);

            ws.onopen = () => {
                console.log("WebSocket connected");
                retryCount = 0;
            };

            ws.onmessage = (event) => {
                const data: WebSocketMessage = JSON.parse(event.data);

                if (data.jobId === jobId) {
                    if (data.type === "progress" && data.progress) {
                        setProgress(data.progress);
                    } else if (data.type === "completed" && data.result) {
                        setProgress({
                            ...data.result,
                            status: "completed",
                        });
                    }
                }
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
                setProgress((prev) => ({
                    ...(prev || { processedLines: 0, errors: 0 }),
                    status: "error",
                    errorMessage:
                        "Failed to connect to server. Please try again later.",
                }));
            };

            ws.onclose = () => {
                if (retryCount < maxRetries) {
                    retryCount++;
                    console.log(`Reconnecting... Attempt ${retryCount}`);
                    setTimeout(connect, 1000 * retryCount);
                }
            };
        };

        connect();

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [jobId]);

    if (!jobId) return null;

    if (!progress) return <div>Waiting for job to start...</div>;

    return (
        <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white my-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    Job Progress
                </h3>
                <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                        progress.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : progress.status === "error"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                    }`}
                >
                    {progress.status}
                </span>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Processed Lines</span>
                    <span className="font-medium text-gray-800">
                        {progress.processedLines}
                    </span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Errors</span>
                    <span className="font-medium text-gray-800">
                        {progress.errors}
                    </span>
                </div>

                {progress.errorMessage && (
                    <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-500 rounded">
                        <div className="text-sm text-gray-600 mb-1">
                            Error Message:
                        </div>
                        <div className="text-red-600 font-medium text-sm">
                            {progress.errorMessage}
                        </div>
                    </div>
                )}
            </div>

            {progress.status !== "error" && (
                <div className="mt-4 pt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full ${
                                progress.status === "completed"
                                    ? "bg-green-500"
                                    : "bg-blue-500"
                            }`}
                            style={{
                                width: `${
                                    (progress.processedLines /
                                        (progress.processedLines +
                                            progress.errors)) *
                                    100
                                }%`,
                            }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
}
