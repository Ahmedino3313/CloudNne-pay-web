"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { adminApi } from "@/lib/api";
import { Withdrawal } from "@/types";
import { ArrowDownToLine, CheckCircle, XCircle, Loader, Filter, RefreshCcw, } from "lucide-react";
import { SkeletonBlock } from "@/components/ui/SkeletonLoader";

const statusOptions = [
    { value: "", label: "All Status" },
    { value: "PENDING", label: "Pending" },
    { value: "PROCESSING", label: "Processing" },
    { value: "COMPLETED", label: "Completed" },
    { value: "FAILED", label: "Failed" },
];

interface WithdrawalWithUser extends Withdrawal {
    user: {
        fullName: string;
        email: string;
        phone: string;
    };
}

export default function AdminWithdrawalsPage() {
    const [withdrawals, setWithdrawals] = useState<WithdrawalWithUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchWithdrawals = async () => {
        setLoading(true);
        try {
        const { data } = await adminApi.getWithdrawals({
            page,
            status: status || undefined,
        });
        setWithdrawals(data.data as unknown as WithdrawalWithUser[]);
        setTotalPages(data.meta?.totalPages ?? 1);
        setTotal(data.meta?.total ?? 0);
        } catch {
        // ignore
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, [page, status]);

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        try {
        await adminApi.updateWithdrawalStatus(id, newStatus);
        setWithdrawals((prev) =>
            prev.map((w) =>
            w.id === id ? { ...w, status: newStatus as any } : w
            )
        );
        } catch {
        // ignore
        } finally {
        setUpdatingId(null);
        }
    };

    const getStatusBadge = (s: string) => {
        switch (s) {
        case "COMPLETED":
            return (
            <span className="badge-success flex items-center gap-1">
                <CheckCircle size={11} /> Completed
            </span>
            );
        case "PROCESSING":
            return (
            <span className="badge-pending flex items-center gap-1">
                <Loader size={11} className="animate-spin" /> Processing
            </span>
            );
        case "FAILED":
            return (
            <span className="badge-failed flex items-center gap-1">
                <XCircle size={11} /> Failed
            </span>
            );
        default:
            return (
            <span className="badge-pending flex items-center gap-1">
                <Loader size={11} /> Pending
            </span>
            );
        }
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
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <ArrowDownToLine
                size={20}
                className="text-success"
                strokeWidth={1.8}
                />
            </div>
            <h1 className="text-2xl font-black text-heading">
                Withdrawals
            </h1>
            </div>
                <p className="text-secondary text-sm">
            {total} withdrawal{total !== 1 ? "s" : ""} total
            </p>
        </motion.div>

        {/* Filter */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card mb-6"
        >
            <div className="flex items-center gap-2 mb-4">
            <Filter size={15} className="text-secondary" />
            <span className="text-sm font-semibold text-heading">
                Filter
            </span>
            </div>
            <div className="flex items-center gap-4">
            <div className="flex-1">
                <label className="block text-xs font-bold text-heading uppercase tracking-wide mb-2">
                    Status
                </label>
                <select
                value={status}
                onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                }}
                >
                {statusOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
                </select>
            </div>
            {status && (
                <button
                onClick={() => {
                    setStatus("");
                    setPage(1);
                }}
                className="flex items-center gap-1 text-xs text-primary mt-6 bg-transparent border-none cursor-pointer hover:underline"
                >
                <RefreshCcw size={12} />
                    Reset
                </button>
            )}
            </div>
        </motion.div>

        {/* Withdrawals list */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-0 overflow-hidden"
        >
            {loading ? (
            <div className="flex flex-col gap-4 p-4">
                {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                    <SkeletonBlock className="w-10 h-10 rounded-xl" />
                    <div className="flex-1">
                    <SkeletonBlock className="w-40 h-4 mb-2" />
                    <SkeletonBlock className="w-56 h-3" />
                    </div>
                    <SkeletonBlock className="w-20 h-6 rounded-full" />
                    <SkeletonBlock className="w-28 h-8 rounded-lg" />
                </div>
                ))}
            </div>
            ) : withdrawals.length === 0 ? (
            <div className="p-12 text-center">
                <ArrowDownToLine
                size={32}
                className="text-secondary mx-auto mb-3"
                />
                <p className="text-heading font-semibold mb-1">
                    No withdrawals found
                </p>
                <p className="text-secondary text-sm">
                    Try changing the filter
                </p>
            </div>
            ) : (
            withdrawals.map((w, i) => (
                <motion.div
                key={w.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 ${
                    i < withdrawals.length - 1 ? "border-b border-border" : ""
                }`}
                >
                {/* Icon */}
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                    <ArrowDownToLine
                    size={16}
                    className="text-success"
                    strokeWidth={1.8}
                    />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-heading">
                        {w.user.fullName}
                    </p>
                    <p className="text-xs text-secondary truncate">
                        {w.user.email} · {w.user.phone}
                    </p>
                    <p className="text-xs text-secondary mt-0.5">
                        &#8358;{w.amount.toLocaleString()} → {w.bankName} ·{" "}
                    {w.accountNumber}
                    </p>
                    <p className="text-xs text-secondary">
                        {w.accountName} ·{" "}
                        {new Date(w.createdAt).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </div>

                {/* Status and actions */}
                <div className="flex items-center gap-2 shrink-0">
                    {getStatusBadge(w.status)}

                    {/* Action buttons for pending/processing */}
                    {(w.status === "PENDING" ||
                    w.status === "PROCESSING") && (
                    <div className="flex items-center gap-2">
                        <button
                        onClick={() =>
                            handleUpdateStatus(w.id, "COMPLETED")
                        }
                        disabled={updatingId === w.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 text-success text-xs font-semibold rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                        {updatingId === w.id ? (
                            <Loader size={12} className="animate-spin" />
                        ) : (
                            <CheckCircle size={12} />
                        )}
                        Complete
                        </button>
                        <button
                        onClick={() =>
                            handleUpdateStatus(w.id, "FAILED")
                        }
                        disabled={updatingId === w.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                        {updatingId === w.id ? (
                            <Loader size={12} className="animate-spin" />
                        ) : (
                            <XCircle size={12} />
                        )}
                        Fail
                        </button>
                    </div>
                    )}
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
                onClick={() =>
                setPage((p) => Math.min(totalPages, p + 1))
                }
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