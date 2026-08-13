"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { adminApi } from "@/lib/api";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, } from "recharts";
import { TrendingUp, Users, Wallet, Calendar, } from "lucide-react";
import { SkeletonBlock } from "@/components/ui/SkeletonLoader";

interface RevenueData {
    revenueToday: number;
    revenueThisMonth: number;
    revenueByType: {
        type: string;
        _sum: { amount: number | null };
        _count: number;
    }[];
    dailyRevenue: { date: string; revenue: number }[];
    newUsersToday: number;
    newUsersThisMonth: number;
    totalWalletBalance: number;
}

const TYPE_COLORS: Record<string, string> = {
    AIRTIME_PURCHASE: "#3B82F6",
    DATA_PURCHASE: "#8B5CF6",
    AIRTIME_CONVERSION: "#E11D48",
    WALLET_FUNDING: "#22C55E",
    WITHDRAWAL: "#F59E0B",
    REFUND: "#94A3B8",
};

const TYPE_LABELS: Record<string, string> = {
    AIRTIME_PURCHASE: "Airtime",
    DATA_PURCHASE: "Data",
    AIRTIME_CONVERSION: "Conversion",
    WALLET_FUNDING: "Funding",
    WITHDRAWAL: "Withdrawal",
    REFUND: "Refund",
};

export default function AdminRevenuePage() {
    const [data, setData] = useState<RevenueData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRevenue = async () => {
        try {
            const { data: res } = await adminApi.getRevenue();
            setData(res.data!);
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
        };
        fetchRevenue();
    }, []);

    // Format date for chart
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        });
    };

    // Format currency for chart tooltip
    const formatCurrency = (value: number) =>
        `₦${value.toLocaleString()}`;

    // Pie chart data
    const pieData = data?.revenueByType.map((r) => ({
        name: TYPE_LABELS[r.type] ?? r.type,
        value: r._sum.amount ?? 0,
        color: TYPE_COLORS[r.type] ?? "#94A3B8",
    })) ?? [];

    const statCards = data
        ? [
            {
                label: "Revenue Today",
                value: `₦${data.revenueToday.toLocaleString()}`,
                icon: TrendingUp,
                color: "text-primary",
                bg: "bg-red-50",
                sub: "From all transactions today",
            },
            {
                label: "Revenue This Month",
                value: `₦${data.revenueThisMonth.toLocaleString()}`,
                icon: Calendar,
                color: "text-blue-500",
                bg: "bg-blue-50",
                sub: "From all transactions this month",
            },
            {
                label: "New Users Today",
                value: data.newUsersToday.toLocaleString(),
                icon: Users,
                color: "text-success",
                bg: "bg-green-50",
                sub: `${data.newUsersThisMonth} new this month`,
            },
            {
                label: "Total Wallet Balance",
                value: `₦${data.totalWalletBalance.toLocaleString()}`,
                icon: Wallet,
                color: "text-purple-500",
                bg: "bg-purple-50",
                sub: "Across all user wallets",
            },
        ]
        : [];

    return (
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                    <TrendingUp
                    size={20}
                    className="text-primary"
                    strokeWidth={1.8}
                    />
                </div>
                <h1 className="text-2xl font-black text-heading">
                    Revenue Dashboard
                </h1>
            </div>
            <p className="text-secondary text-sm">
                Platform revenue and growth metrics
            </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {loading
            ? [1, 2, 3, 4].map((i) => (
                <div key={i} className="card">
                    <SkeletonBlock className="w-10 h-10 rounded-xl mb-4" />
                    <SkeletonBlock className="w-24 h-7 mb-2" />
                    <SkeletonBlock className="w-32 h-4" />
                </div>
                ))
            : statCards.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="card"
                >
                    <div
                    className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}
                    >
                    <stat.icon
                        size={20}
                        className={stat.color}
                        strokeWidth={1.8}
                    />
                    </div>
                    <p className="text-xl font-black text-heading mb-1">
                        {stat.value}
                    </p>
                    <p className="text-sm font-semibold text-heading mb-0.5">
                        {stat.label}
                    </p>
                    <p className="text-xs text-secondary">{stat.sub}</p>
                </motion.div>
                ))}
        </div>

        {/* Daily revenue chart */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card mb-6"
        >
            <h2 className="text-base font-bold text-heading mb-1">
                Daily Revenue — Last 30 Days
            </h2>
            <p className="text-xs text-secondary mb-6">
                Total transaction volume per day
            </p>

            {loading ? (
            <SkeletonBlock className="w-full h-64" />
            ) : (
            <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data?.dailyRevenue ?? []}>
                <defs>
                    <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                    >
                    <stop
                        offset="5%"
                        stopColor="#E11D48"
                        stopOpacity={0.15}
                    />
                    <stop
                        offset="95%"
                        stopColor="#E11D48"
                        stopOpacity={0}
                    />
                    </linearGradient>
                </defs>
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E2E8F0"
                    vertical={false}
                />
                <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    tick={{ fontSize: 11, fill: "#94A3B8" }}
                    tickLine={false}
                    axisLine={false}
                    interval={4}
                />
                <YAxis
                    tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 11, fill: "#94A3B8" }}
                    tickLine={false}
                    axisLine={false}
                />
            <Tooltip
                formatter={(value) => [
                    formatCurrency(Number(value)),
                    "Revenue",
                ]}
                labelFormatter={(label) => formatDate(String(label))}
                contentStyle={{
                    background: "#fff",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    fontSize: "13px",
                }}
                />
                <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#E11D48"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                    dot={false}
                    activeDot={{ r: 5, fill: "#E11D48" }}
                />
                </AreaChart>
            </ResponsiveContainer>
            )}
        </motion.div>

        {/* Revenue by type */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-2 gap-6"
        >
            {/* Pie chart */}
            <div className="card">
            <h2 className="text-base font-bold text-heading mb-1">
                Revenue by Service
            </h2>
            <p className="text-xs text-secondary mb-6">
                This month&apos;s breakdown
            </p>

            {loading ? (
                <SkeletonBlock className="w-full h-48" />
            ) : pieData.length === 0 ? (
                <div className="h-48 flex items-center justify-center">
                <p className="text-secondary text-sm">
                    No data for this month yet
                </p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    >
                    {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                    ))}
                    </Pie>
                    <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{
                        background: "#fff",
                        border: "1px solid #E2E8F0",
                        borderRadius: "12px",
                        fontSize: "13px",
                    }}
                    />
                    <Legend
                    formatter={(value) => (
                        <span style={{ fontSize: "12px", color: "#0F172A" }}>
                        {value}
                        </span>
                    )}
                    />
                </PieChart>
                </ResponsiveContainer>
            )}
            </div>

            {/* Transaction breakdown table */}
            <div className="card">
            <h2 className="text-base font-bold text-heading mb-1">
                Transaction Breakdown
            </h2>
            <p className="text-xs text-secondary mb-6">
                This month by service type
            </p>

            {loading ? (
                <div className="flex flex-col gap-3">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                    <SkeletonBlock className="w-3 h-3 rounded-full" />
                    <SkeletonBlock className="flex-1 h-4" />
                    <SkeletonBlock className="w-20 h-4" />
                    </div>
                ))}
                </div>
            ) : data?.revenueByType.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                <p className="text-secondary text-sm">No transactions yet</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                {data?.revenueByType.map((r) => (
                    <div
                    key={r.type}
                    className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl"
                    >
                    <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{
                        background: TYPE_COLORS[r.type] ?? "#94A3B8",
                        }}
                    />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-heading">
                        {TYPE_LABELS[r.type] ?? r.type}
                        </p>
                        <p className="text-xs text-secondary">
                        {r._count} transaction{r._count !== 1 ? "s" : ""}
                        </p>
                    </div>
                    <p className="text-sm font-bold text-heading">
                        &#8358;{(r._sum.amount ?? 0).toLocaleString()}
                    </p>
                    </div>
                ))}
                </div>
            )}
            </div>
        </motion.div>
        </div>
    );
}