"use client";

import { useEffect, useState, } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { walletApi, transactionApi } from "@/lib/api";
import { Transaction, Wallet } from "@/types";
import { Smartphone, Wifi, RefreshCw, ArrowDownToLine, TrendingUp, Clock, CheckCircle, XCircle, Loader, Eye, EyeOff, } from "lucide-react";
import { SkeletonBlock } from "@/components/ui/SkeletonLoader";

const quickActions = [
    {
        label: "Buy Airtime",
        icon: Smartphone,
        href: "/dashboard/airtime",
        color: "text-blue-500",
        bg: "bg-blue-50",
    },
    {
        label: "Buy Data",
        icon: Wifi,
        href: "/dashboard/data",
        color: "text-purple-500",
        bg: "bg-purple-50",
    },
    {
        label: "Convert Airtime",
        icon: RefreshCw,
        href: "/dashboard/convert",
        color: "text-primary",
        bg: "bg-red-50",
    },
    {
        label: "Withdraw",
        icon: ArrowDownToLine,
        href: "/dashboard/withdraw",
        color: "text-success",
        bg: "bg-green-50",
    },
];

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loadingWallet, setLoadingWallet] = useState(true);
    const [loadingTxns, setLoadingTxns] = useState(true);
    const [hideBalance, setHideBalance] = useState(false);

    useEffect(() => {
        const fetchWallet = async () => {
        try {
            const { data } = await walletApi.getWallet();
            setWallet(data.data!);
        } catch {
            // ignore
        } finally {
            setLoadingWallet(false);
        }
        };

        const fetchTransactions = async () => {
        try {
            const { data } = await transactionApi.getAll({ limit: 5 });
            setTransactions(data.data!);
        } catch {
            // ignore
        } finally {
            setLoadingTxns(false);
        }
        };

        fetchWallet();
        fetchTransactions();
    }, []);

    const getStatusIcon = (status: string) => {
        if (status === "SUCCESS")
        return <CheckCircle size={15} className="text-success" />;
        if (status === "PENDING")
        return <Loader size={15} className="text-yellow-500 animate-spin" />;
        return <XCircle size={15} className="text-red-500" />;
    };

    const getTypeLabel = (type: string) => {
        return type
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    return (
        <div className="max-w-5xl mx-auto">

            {/* Greeting */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-2xl font-black text-heading">
                    Good day, {user?.fullName?.split(" ")[0]}!
                </h1>
                <p className="text-secondary text-sm mt-1">
                    Here&apos;s what&apos;s happening with your account
                </p>
            </motion.div>

            {/* Wallet card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-2xl p-6 mb-6 relative overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, #E11D48 0%, #0F172A 100%)",
                }}
            >
                {/* Background pattern */}
                <div className="absolute inset-0 grid-bg opacity-20" />

                <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-white/70 text-sm font-medium">
                        Wallet Balance
                        </p>

                        <button
                            onClick={() => setHideBalance(!hideBalance)}
                            className="text-white/70 hover:text-white bg-transparent border-none cursor-pointer transition-colors"
                        >
                            {hideBalance ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {loadingWallet ? (
                        <SkeletonBlock className="w-48 h-10 mb-2 bg-white/10" />
                    ) : (
                        <p className="text-4xl font-black text-white mb-1">
                            {hideBalance
                                ? "₦••••••"
                                : `₦${wallet?.balance.toLocaleString() ?? "0"}`}
                            {!hideBalance && (
                                <span className="text-xl text-white/50">.00</span>
                            )}
                        </p>
                    )}

                    <p className="text-white/50 text-sm mb-6">
                        {wallet?.currency ?? "NGN"} Account
                    </p>

                    {/* Virtual account */}
                    {wallet?.virtualAccount?.accountNumber ? (
                        <div className="bg-white/10 rounded-xl p-3 inline-flex flex-col">
                            <p className="text-white/60 text-xs mb-1">Virtual Account</p>
                            <p className="text-white font-bold text-lg tracking-wider">
                                {wallet.virtualAccount.accountNumber}
                            </p>
                            <p className="text-white/60 text-xs mt-1">
                                {wallet.virtualAccount.bankName}
                            </p>
                        </div>
                    ) : (
                        <Link
                            href="/dashboard/settings"
                            className="no-underline inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                        >
                            Get Virtual Account
                        </Link>
                    )}
                </div>
            </motion.div>

            {/* Quick actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
            >
                <h2 className="text-base font-bold text-heading mb-4">
                    Quick Actions
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, i) => (
                        <motion.div
                            key={action.href}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.07 + 0.2 }}
                            whileHover={{ y: -3 }}
                        >
                            <Link
                                href={action.href}
                                className="no-underline card flex flex-col items-center text-center p-4 hover:border-primary/30 hover:shadow-md transition-all duration-200"
                            >
                                <div
                                    className={`w-12 h-12 ${action.bg} rounded-xl flex items-center justify-center mb-3`}
                                >
                                    <action.icon
                                        size={22}
                                        className={action.color}
                                        strokeWidth={1.8}
                                    />
                                </div>

                                <p className="text-sm font-semibold text-heading">
                                    {action.label}
                                </p>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Recent transactions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-heading flex items-center gap-2">
                        <Clock size={16} className="text-primary" />
                        Recent Transactions
                    </h2>

                    <Link
                        href="/dashboard/transactions"
                        className="text-sm text-primary no-underline font-semibold hover:underline"
                    >
                        View all
                    </Link>
                </div>

                <div className="card p-0 overflow-hidden">
                    {loadingTxns ? (
                        <div className="flex flex-col gap-4 p-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <SkeletonBlock className="w-10 h-10 rounded-xl" />
                                        <div className="flex-1">
                                            <SkeletonBlock className="w-32 h-4 mb-2" />
                                            <SkeletonBlock className="w-24 h-3" />
                                        </div>
                                    <SkeletonBlock className="w-16 h-4" />
                                </div>
                            ))}
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="p-8 text-center">
                            <TrendingUp size={32} className="text-secondary mx-auto mb-3" />

                            <p className="text-heading font-semibold mb-1">
                                No transactions yet
                            </p>

                            <p className="text-secondary text-sm">
                                Start by buying airtime or converting airtime to cash
                            </p>
                        </div>
                    ) : (
                        transactions.map((txn, i) => (
                            <div
                                key={txn.id}
                                className={`flex items-center gap-3 p-4 hover:bg-card transition-colors ${ i < transactions.length - 1 ? "border-b border-border" : "" }`}
                            >
                                {/* Icon */}
                                <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
                                    {txn.type === "AIRTIME_PURCHASE" && (
                                        <Smartphone size={16} className="text-blue-500" />
                                    )}
                                    {txn.type === "DATA_PURCHASE" && (
                                        <Wifi size={16} className="text-purple-500" />
                                    )}
                                    {txn.type === "AIRTIME_CONVERSION" && (
                                        <RefreshCw size={16} className="text-primary" />
                                    )}
                                    {txn.type === "WITHDRAWAL" && (
                                        <ArrowDownToLine size={16} className="text-success" />
                                    )}
                                    {txn.type === "WALLET_FUNDING" && (
                                        <TrendingUp size={16} className="text-success" />
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-heading truncate">
                                        {getTypeLabel(txn.type)}
                                    </p>

                                    <p className="text-xs text-secondary">
                                        {new Date(txn.createdAt).toLocaleDateString("en-NG", {
                                        day: "numeric",
                                        month: "short",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        })}
                                    </p>
                                </div>

                                {/* Amount and status */}
                                <div className="flex flex-col items-end gap-1">
                                    <p
                                        className={`text-sm font-bold ${
                                        txn.type === "AIRTIME_CONVERSION" ||
                                        txn.type === "WALLET_FUNDING"
                                            ? "text-success"
                                            : "text-heading"
                                        }`}
                                    >
                                        {txn.type === "AIRTIME_CONVERSION" ||
                                        txn.type === "WALLET_FUNDING"
                                        ? "+"
                                        : "-"}
                                        ₦{txn.amount.toLocaleString()}
                                    </p>

                                    <div className="flex items-center gap-1">
                                        {getStatusIcon(txn.status)}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
}