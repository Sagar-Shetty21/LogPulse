import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "LogPulse",
    description: "Track your Log Analytics data with ease.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen overflow-hidden bg-gray-50 flex flex-col`}
            >
                <AuthProvider>
                    <Navbar />
                    <div className="flex-1 overflow-y-auto">{children}</div>
                </AuthProvider>
                <Toaster position="top-right" />
            </body>
        </html>
    );
}
