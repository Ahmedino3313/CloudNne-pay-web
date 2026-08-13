"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { adminApi } from "@/lib/api";
import { Shield, User, Clock, Monitor, Globe, } from "lucide-react";
import { SkeletonBlock } from "@/components/ui/SkeletonLoader";

interface AuditLog {
    id: string;
    action: string;
    entity: string;
    entityId: string | null;
    ip: string | null;
    userAgent: string | null;
    createdAt: string;
    user: { fullName: string; email: string } | null;
}

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchLogs = async () => {
        setLoading(true);
        try {
        const { data } = await adminApi.getAuditLogs({ page });
        setLogs(data.data!);
        setTotalPages(data.meta?.totalPages ?? 1);
        setTotal(data.meta?.total ?? 0);
        } catch {
        // ignore
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page]);

    const getActionColor = (action: string) => {
        if (action.includes("LOGIN") || action.includes("REGISTER"))
        return "text-blue-500 bg-blue-50";
        if (action.includes("DELETE") || action.includes("DEACTIVATE"))
        return "text-red-500 bg-red-50";
        if (action.includes("UPDATE") || action.includes("APPROVE"))
        return "text-success bg-green-50";
        return "text-secondary bg-card";
    };

    const formatUserAgent = (ua: string | null) => {
        if (!ua) return "Unknown";
        if (ua.includes("Edg")) return "Edge";
        if (ua.includes("Chrome")) return "Chrome";
        if (ua.includes("Firefox")) return "Firefox";
        if (ua.includes("Safari")) return "Safari";
        return "Unknown Browser";
    };

    const formatIp = (ip: string | null) => {
    if (!ip) return "Unknown";
    // Convert IPv6 localhost to readable format
    if (ip === "::1" || ip === "::ffff:127.0.0.1") return "localhost";
    // Remove IPv6 prefix from IPv4 addresses
    if (ip.startsWith("::ffff:")) return ip.replace("::ffff:", "");
    return ip;
    };

    return (
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Shield
                    size={20}
                    className="text-purple-500"
                    strokeWidth={1.8}
                    />
                </div>
                <h1 className="text-2xl font-black text-heading">
                    Audit Logs
                </h1>
            </div>

            <p className="text-secondary text-sm">
                {total} log{total !== 1 ? "s" : ""} recorded
            </p>
        </motion.div>

        {/* Logs */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-0 overflow-hidden"
        >
            {loading ? (
            <div className="flex flex-col gap-4 p-4">
                {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-3">
                    <SkeletonBlock className="w-10 h-10 rounded-xl shrink-0" />
                    <div className="flex-1">
                    <SkeletonBlock className="w-48 h-4 mb-2" />
                    <SkeletonBlock className="w-64 h-3 mb-1" />
                    <SkeletonBlock className="w-32 h-3" />
                    </div>
                </div>
                ))}
            </div>
            ) : logs.length === 0 ? (
            <div className="p-12 text-center">
                <Shield
                size={32}
                className="text-secondary mx-auto mb-3"
                />
                <p className="text-heading font-semibold mb-1">
                    No audit logs yet
                </p>
                <p className="text-secondary text-sm">
                    Actions will be recorded here
                </p>
            </div>
            ) : (
            logs.map((log, i) => (
                <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-start gap-4 p-4 ${
                    i < logs.length - 1 ? "border-b border-border" : ""
                } hover:bg-card transition-colors`}
                >
                    {/* Action badge */}
                    <div
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 mt-0.5 ${getActionColor(
                        log.action
                        )}`}
                    >
                        {log.action}
                    </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-semibold text-heading">
                            {log.entity}
                        </span>

                        {log.entityId && (
                            <span className="text-xs text-secondary font-mono">
                            #{log.entityId.substring(0, 8)}
                            </span>
                        )}
                        </div>

                        <div className="flex items-center gap-4 flex-wrap">
                            {/* User */}
                            {log.user && (
                                <div className="flex items-center gap-1 text-xs text-secondary">
                                <User size={11} />
                                {log.user.fullName}
                                </div>
                            )}

                            {/* IP */}
                            {log.ip && (
                                <div className="flex items-center gap-1 text-xs text-secondary">
                                    <Globe size={11} />
                                    {formatIp(log.ip)}
                                </div>
                            )}

                            {/* Browser */}
                            <div className="flex items-center gap-1 text-xs text-secondary">
                                <Monitor size={11} />
                                {formatUserAgent(log.userAgent)}s
                            </div>

                            {/* Time */}
                            <div className="flex items-center gap-1 text-xs text-secondary">
                                <Clock size={11} />
                                {new Date(log.createdAt).toLocaleDateString("en-NG", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))
            )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-secondary px-4 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
            <span className="text-sm text-secondary">
                Page {page} of {totalPages}
            </span>
            <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary px-4 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
                Next
            </button>
            </div>
        )}
        </div>
    );
}