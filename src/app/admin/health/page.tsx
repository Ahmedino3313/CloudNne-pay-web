"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { adminApi } from "@/lib/api";
import { Activity, Database, CreditCard, Building2, CheckCircle, XCircle, RefreshCw, } from "lucide-react";

interface ServiceStatus {
    name: string;
    status: string;
}

interface HealthData {
    status: string;
    timestamp: string;
    services: {
        database: ServiceStatus;
        paystack: ServiceStatus;
        monnify: ServiceStatus;
    };
}

export default function AppHealthPage() {
    const [health, setHealth] = useState<HealthData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastChecked, setLastChecked] = useState<string>("");

    const fetchHealth = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        try {
        const { data } = await adminApi.getHealth();
        setHealth(data.data!);
        setLastChecked(new Date().toLocaleTimeString("en-NG"));
        } catch {
        // ignore
        } finally {
        setLoading(false);
        setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHealth();

        // Auto refresh every 60 seconds
        const interval = setInterval(() => fetchHealth(true), 60000);
        return () => clearInterval(interval);
    }, []);

    const services = health
        ? [
            {
                key: "database",
                label: "Neon PostgreSQL",
                desc: "Primary database for all app data",
                icon: Database,
                color: "text-blue-500",
                bg: "bg-blue-50",
                status: health.services.database.status,
            },
            {
                key: "paystack",
                label: "Paystack",
                desc: "Payment processing and bank verification",
                icon: CreditCard,
                color: "text-green-500",
                bg: "bg-green-50",
                status: health.services.paystack.status,
            },
            {
                key: "monnify",
                label: "Monnify",
                desc: "Virtual accounts and wallet funding",
                icon: Building2,
                color: "text-purple-500",
                bg: "bg-purple-50",
                status: health.services.monnify.status,
            },
        ]
        : [];

    const allOperational =
        health &&
        Object.values(health.services).every((s) => s.status === "operational");

    return (
        <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
        >
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 bg-card border border-border rounded-xl flex items-center justify-center">
                    <Activity
                        size={20}
                        className="text-primary"
                        strokeWidth={1.8}
                    />
                    </div>
                    <h1 className="text-2xl font-black text-heading">
                        App Health
                    </h1>
                </div>
                <p className="text-secondary text-sm">
                    {lastChecked ? `Last checked: ${lastChecked}` : "Checking..."}
                </p>
            </div>

            {/* Refresh button */}
            <button
            onClick={() => fetchHealth(true)}
            disabled={refreshing}
            className="flex items-center gap-2 btn-secondary px-4 py-2.5 text-sm"
            >
            <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : ""}
            />
            Refresh
            </button>
        </motion.div>

        {/* Overall status banner */}
        {!loading && health && (
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-2xl p-5 mb-6 flex items-center gap-4 ${
                allOperational
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
            >
            <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                allOperational ? "bg-green-100" : "bg-red-100"
                }`}
            >
                {allOperational ? (
                <CheckCircle size={24} className="text-success" />
                ) : (
                <XCircle size={24} className="text-red-500" />
                )}
            </div>
            <div>
                <p
                className={`font-bold text-lg ${
                    allOperational ? "text-success" : "text-red-600"
                }`}
                >
                {allOperational
                    ? "All Systems Operational 🟢"
                    : "Some Services Down 🔴"}
                </p>
                <p className="text-secondary text-sm">
                {allOperational
                    ? "CloudNine Pay is running smoothly"
                    : "Some features may be unavailable"}
                </p>
            </div>
            </motion.div>
        )}

        {/* Services */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-0 overflow-hidden"
        >
            {loading ? (
            <div className="flex flex-col gap-4 p-6">
                {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-border rounded-xl animate-pulse" />
                    <div className="flex-1">
                        <div className="w-32 h-4 bg-border rounded mb-2 animate-pulse" />
                        <div className="w-48 h-3 bg-border rounded animate-pulse" />
                    </div>
                    <div className="w-24 h-6 bg-border rounded-full animate-pulse" />
                </div>
                ))}
            </div>
            ) : (
            services.map((service, i) => (
                <motion.div
                key={service.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`flex items-center gap-4 p-5 ${
                    i < services.length - 1 ? "border-b border-border" : ""
                }`}
                >
                {/* Icon */}
                <div
                    className={`w-12 h-12 ${service.bg} rounded-xl flex items-center justify-center shrink-0`}
                >
                    <service.icon
                    size={22}
                    className={service.color}
                    strokeWidth={1.8}
                    />
                </div>

                {/* Details */}
                <div className="flex-1">
                    <p className="text-sm font-bold text-heading">
                    {service.label}
                    </p>
                    <p className="text-xs text-secondary">{service.desc}</p>
                </div>

                {/* Status badge */}
                {service.status === "operational" ? (
                    <span className="badge-success flex items-center gap-1.5">
                    <CheckCircle size={12} />
                        Operational
                    </span>
                ) : (
                    <span className="badge-failed flex items-center gap-1.5">
                    <XCircle size={12} />
                        Down
                    </span>
                )}
                </motion.div>
            ))
            )}
        </motion.div>

        {/* Auto refresh note */}
        <p className="text-xs text-secondary text-center mt-4">
            Auto-refreshes every 60 seconds
        </p>
        </div>
    );
}