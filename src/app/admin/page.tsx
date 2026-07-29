"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { adminApi } from "@/lib/api";
import { Users, RefreshCw, TrendingUp, Clock, CheckCircle, XCircle, Loader, } from "lucide-react";
import { SkeletonBlock } from "@/components/ui/SkeletonLoader";

interface Analytics {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  successfulConversions: number;
  pendingWithdrawals: number;
  totalVolume: number;
}

interface PendingConversion {
  id: string;
  network: string;
  airtimeAmount: number;
  cashValue: number;
  status: string;
  createdAt: string;
  user: {
    fullName: string;
    email: string;
    phone: string;
  };
}

export default function AdminPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
const [pendingConversions, setPendingConversions] = useState<PendingConversion[]>([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [loadingConversions, setLoadingConversions] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await adminApi.getAnalytics();
        setAnalytics(data.data!);
      } catch {
        // ignore
      } finally {
        setLoadingAnalytics(false);
      }
    };

    const fetchConversions = async () => {
      try {
        const { data } = await adminApi.getPendingConversions();
        setPendingConversions((data.data ?? []) as unknown as PendingConversion[]);
      } catch {
        // ignore
      } finally {
        setLoadingConversions(false);
      }
    };

    fetchAnalytics();
    fetchConversions();
  }, []);

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    try {
      await adminApi.approveConversion(id);
      setPendingConversions((prev) => prev.filter((c) => c.id !== id));
        setAnalytics((prev: Analytics | null) =>
        prev
            ? {
                ...prev,
                successfulConversions: prev.successfulConversions + 1,
            }
            : prev
        );
    } catch {
      // ignore
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setRejectingId(id);
    try {
      await adminApi.rejectConversion(id);
      setPendingConversions((prev) => prev.filter((c) => c.id !== id));
    } catch {
      // ignore
    } finally {
      setRejectingId(null);
    }
  };

  const statCards = analytics
    ? [
        {
          label: "Total Users",
          value: analytics.totalUsers.toLocaleString(),
          icon: Users,
          color: "text-blue-500",
          bg: "bg-blue-50",
        },
        {
          label: "Active Users",
          value: analytics.activeUsers.toLocaleString(),
          icon: Users,
          color: "text-success",
          bg: "bg-green-50",
        },
        {
          label: "Total Transactions",
          value: analytics.totalTransactions.toLocaleString(),
          icon: TrendingUp,
          color: "text-purple-500",
          bg: "bg-purple-50",
        },
        {
          label: "Conversions Done",
          value: analytics.successfulConversions.toLocaleString(),
          icon: RefreshCw,
          color: "text-primary",
          bg: "bg-red-50",
        },
        {
          label: "Pending Withdrawals",
          value: analytics.pendingWithdrawals.toLocaleString(),
          icon: Clock,
          color: "text-yellow-500",
          bg: "bg-yellow-50",
        },
        {
          label: "Total Volume",
          value: `₦${analytics.totalVolume.toLocaleString()}`,
          icon: TrendingUp,
          color: "text-success",
          bg: "bg-green-50",
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
        <h1 className="text-2xl font-black text-heading mb-1">
          Admin Dashboard
        </h1>
        <p className="text-secondary text-sm">
          CloudNine Pay platform overview
        </p>
      </motion.div>

      {/* Analytics cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {loadingAnalytics
          ? [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card">
                <SkeletonBlock className="w-10 h-10 rounded-xl mb-4" />
                <SkeletonBlock className="w-20 h-7 mb-2" />
                <SkeletonBlock className="w-28 h-4" />
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
                <p className="text-2xl font-black text-heading mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-secondary">{stat.label}</p>
              </motion.div>
            ))}
      </div>

      {/* Pending conversions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-base font-bold text-heading mb-4 flex items-center gap-2">
          <Clock size={16} className="text-primary" />
          Pending Conversions
          {pendingConversions.length > 0 && (
            <span className="badge-pending">
              {pendingConversions.length}
            </span>
          )}
        </h2>

        <div className="card p-0 overflow-hidden">
          {loadingConversions ? (
            <div className="flex flex-col gap-4 p-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <SkeletonBlock className="w-10 h-10 rounded-xl" />
                  <div className="flex-1">
                    <SkeletonBlock className="w-40 h-4 mb-2" />
                    <SkeletonBlock className="w-28 h-3" />
                  </div>
                  <SkeletonBlock className="w-24 h-8 rounded-lg" />
                </div>
              ))}
            </div>
          ) : pendingConversions.length === 0 ? (
            <div className="p-10 text-center">
              <CheckCircle
                size={32}
                className="text-success mx-auto mb-3"
              />
              <p className="text-heading font-semibold mb-1">
                All clear!
              </p>
              <p className="text-secondary text-sm">
                No pending conversions to review
              </p>
            </div>
          ) : (
            pendingConversions.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-4 p-4 ${
                  i < pendingConversions.length - 1
                    ? "border-b border-border"
                    : ""
                }`}
              >
                {/* Icon */}
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                  <RefreshCw
                    size={16}
                    className="text-primary"
                    strokeWidth={1.8}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-heading truncate">
                    {c.user.fullName}
                  </p>
                  <p className="text-xs text-secondary truncate">
                    {c.user.phone} · {c.network} · ₦
                    {c.airtimeAmount.toLocaleString()} airtime → ₦
                    {c.cashValue.toLocaleString()}
                  </p>
                  <p className="text-xs text-secondary mt-0.5">
                    {new Date(c.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(c.id)}
                    disabled={
                      approvingId === c.id || rejectingId === c.id
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 text-success text-xs font-semibold rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {approvingId === c.id ? (
                      <Loader size={12} className="animate-spin" />
                    ) : (
                      <CheckCircle size={12} />
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(c.id)}
                    disabled={
                      approvingId === c.id || rejectingId === c.id
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {rejectingId === c.id ? (
                      <Loader size={12} className="animate-spin" />
                    ) : (
                      <XCircle size={12} />
                    )}
                    Reject
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}