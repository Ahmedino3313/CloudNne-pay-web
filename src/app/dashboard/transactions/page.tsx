"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { transactionApi } from "@/lib/api";
import { Transaction } from "@/types";
import { Clock, Smartphone, Wifi, RefreshCw, ArrowDownToLine, TrendingUp, CheckCircle, XCircle, Loader, Filter, RefreshCcw, } from "lucide-react";
import { SkeletonBlock } from "@/components/ui/SkeletonLoader";

const typeOptions = [
    { value: "", label: "All Types" },
    { value: "AIRTIME_PURCHASE", label: "Airtime Purchase" },
    { value: "DATA_PURCHASE", label: "Data Purchase" },
    { value: "AIRTIME_CONVERSION", label: "Airtime Conversion" },
    { value: "WALLET_FUNDING", label: "Wallet Funding" },
    { value: "WITHDRAWAL", label: "Withdrawal" },
];

const statusOptions = [
    { value: "", label: "All Status" },
    { value: "SUCCESS", label: "Success" },
    { value: "PENDING", label: "Pending" },
    { value: "FAILED", label: "Failed" },
];

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
        const { data } = await transactionApi.getAll({
            page,
            limit: 10,
            type: type || undefined,
            status: status || undefined,
        });
        setTransactions(data.data!);
        setTotalPages(data.meta?.totalPages ?? 1);
        setTotal(data.meta?.total ?? 0);
        } catch {
        // ignore
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [page, type, status]);

    const getTypeIcon = (txnType: string) => {
        switch (txnType) {
        case "AIRTIME_PURCHASE":
            return <Smartphone size={16} className="text-blue-500" />;
        case "DATA_PURCHASE":
            return <Wifi size={16} className="text-purple-500" />;
        case "AIRTIME_CONVERSION":
            return <RefreshCw size={16} className="text-primary" />;
        case "WITHDRAWAL":
            return <ArrowDownToLine size={16} className="text-success" />;
        case "WALLET_FUNDING":
            return <TrendingUp size={16} className="text-success" />;
        default:
            return <Clock size={16} className="text-secondary" />;
        }
    };

    const getStatusBadge = (txnStatus: string) => {
        switch (txnStatus) {
        case "SUCCESS":
            return (
            <span className="badge-success flex items-center gap-1">
                <CheckCircle size={11} /> Success
            </span>
            );
        case "PENDING":
            return (
            <span className="badge-pending flex items-center gap-1">
                <Loader size={11} className="animate-spin" /> Pending
            </span>
            );
        case "FAILED":
            return (
            <span className="badge-failed flex items-center gap-1">
                <XCircle size={11} /> Failed
            </span>
            );
        default:
            return null;
        }
    };

    const getTypeLabel = (txnType: string) => {
        return txnType
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    const isCredit = (txnType: string) =>
        txnType === "AIRTIME_CONVERSION" || txnType === "WALLET_FUNDING";

    return (
        <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-card border border-border rounded-xl flex items-center justify-center">
                <Clock size={20} className="text-primary" strokeWidth={1.8} />
            </div>
            <h1 className="text-2xl font-black text-heading">Transactions</h1>
            </div>
            <p className="text-secondary text-sm">
            {total} transaction{total !== 1 ? "s" : ""} found
            </p>
        </motion.div>

        {/* Filters */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card mb-6"
        >
            <div className="flex items-center gap-2 mb-4">
                <Filter size={15} className="text-secondary" />
                <span className="text-sm font-semibold text-heading">Filters</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-heading uppercase tracking-wide mb-2">
                        Type
                    </label>

                    <select
                        value={type}
                        onChange={(e) => {
                            setType(e.target.value);
                            setPage(1);
                        }}
                    >
                        {typeOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                            {o.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
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
            </div>

            {/* Reset filters */}
            {(type || status) && (
            <button
                onClick={() => {
                setType("");
                setStatus("");
                setPage(1);
                }}
                className="flex items-center gap-1 text-xs text-primary mt-3 bg-transparent border-none cursor-pointer hover:underline"
            >
                <RefreshCcw size={12} />
                Reset filters
            </button>
            )}
        </motion.div>

        {/* Transactions list */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-0 overflow-hidden"
        >
            {loading ? (
            <div className="flex flex-col gap-4 p-4">
                {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                    <SkeletonBlock className="w-10 h-10 rounded-xl" />
                    <div className="flex-1">
                        <SkeletonBlock className="w-40 h-4 mb-2" />
                        <SkeletonBlock className="w-28 h-3" />
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <SkeletonBlock className="w-20 h-4" />
                        <SkeletonBlock className="w-16 h-5 rounded-full" />
                    </div>
                </div>
                ))}
            </div>
            ) : transactions.length === 0 ? (
            <div className="p-12 text-center">
                <Clock size={36} className="text-secondary mx-auto mb-3" />
                <p className="text-heading font-semibold mb-1">
                No transactions found
                </p>
                <p className="text-secondary text-sm">
                Try changing your filters or make a transaction
                </p>
            </div>
            ) : (
            transactions.map((txn, i) => (
                <motion.div
                key={txn.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 p-4 hover:bg-card transition-colors cursor-default ${
                    i < transactions.length - 1 ? "border-b border-border" : ""
                }`}
                >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center shrink-0">
                    {getTypeIcon(txn.type)}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-heading truncate">
                    {getTypeLabel(txn.type)}
                    </p>
                    <p className="text-xs text-secondary truncate">
                    {txn.description ?? txn.reference}
                    </p>
                    <p className="text-xs text-secondary mt-0.5">
                    {new Date(txn.createdAt).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                    </p>
                </div>

                {/* Amount and status */}
                <div className="flex flex-col items-end gap-1.5">
                    <p
                    className={`text-sm font-bold ${
                        isCredit(txn.type) ? "text-success" : "text-heading"
                    }`}
                    >
                    {isCredit(txn.type) ? "+" : "-"}₦
                    {txn.amount.toLocaleString()}
                    </p>
                    {getStatusBadge(txn.status)}
                </div>
                </motion.div>
            ))
            )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between mt-6"
            >
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
            </motion.div>
        )}
        </div>
    );
}