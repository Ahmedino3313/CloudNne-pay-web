"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { notificationApi } from "@/lib/api";
import { Notification } from "@/types";
import { Bell, CheckCheck, Info, CheckCircle, AlertTriangle, XCircle, Loader, } from "lucide-react";
import { SkeletonBlock } from "@/components/ui/SkeletonLoader";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [markingAll, setMarkingAll] = useState(false);

    const fetchNotifications = async () => {
        try {
        const { data } = await notificationApi.getAll();
        setNotifications(data.data!.notifications);
        setUnreadCount(data.data!.unreadCount);
        } catch {
        // ignore
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAllRead = async () => {
        setMarkingAll(true);
        try {
        await notificationApi.markAllRead();
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, isRead: true }))
        );
        setUnreadCount(0);
        } catch {
        // ignore
        } finally {
        setMarkingAll(false);
        }
    };

    const handleMarkOneRead = async (id: string) => {
        try {
        await notificationApi.markRead(id);
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch {
        // ignore
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
        case "success":
            return <CheckCircle size={18} className="text-success" />;
        case "warning":
            return <AlertTriangle size={18} className="text-yellow-500" />;
        case "error":
            return <XCircle size={18} className="text-red-500" />;
        default:
            return <Info size={18} className="text-blue-500" />;
        }
    };

    const getIconBg = (type: string) => {
        switch (type) {
        case "success": return "bg-green-50";
        case "warning": return "bg-yellow-50";
        case "error": return "bg-red-50";
        default: return "bg-blue-50";
        }
    };

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
                <div className="w-10 h-10 bg-card border border-border rounded-xl flex items-center justify-center relative">
                <Bell size={20} className="text-primary" strokeWidth={1.8} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                    </span>
                )}
                </div>
                <h1 className="text-2xl font-black text-heading">
                Notifications
                </h1>
            </div>
            <p className="text-secondary text-sm">
                {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "All caught up!"}
            </p>
            </div>

            {/* Mark all read button */}
            {unreadCount > 0 && (
            <button
                onClick={handleMarkAllRead}
                disabled={markingAll}
                className="flex items-center gap-2 text-sm text-primary font-semibold bg-transparent border-none cursor-pointer hover:underline disabled:opacity-50"
            >
                {markingAll ? (
                <Loader size={14} className="animate-spin" />
                ) : (
                <CheckCheck size={14} />
                )}
                Mark all read
            </button>
            )}
        </motion.div>

        {/* Notifications list */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-0 overflow-hidden"
        >
            {loading ? (
            <div className="flex flex-col gap-4 p-4">
                {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3">
                    <SkeletonBlock className="w-10 h-10 rounded-xl shrink-0" />
                    <div className="flex-1">
                    <SkeletonBlock className="w-48 h-4 mb-2" />
                    <SkeletonBlock className="w-full h-3 mb-1" />
                    <SkeletonBlock className="w-24 h-3" />
                    </div>
                </div>
                ))}
            </div>
            ) : notifications.length === 0 ? (
            <div className="p-12 text-center">
                <Bell size={36} className="text-secondary mx-auto mb-3" />
                <p className="text-heading font-semibold mb-1">
                No notifications yet
                </p>
                <p className="text-secondary text-sm">
                We&apos;ll notify you about your transactions and account activity
                </p>
            </div>
            ) : (
            <AnimatePresence>
                {notifications.map((n, i) => (
                <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => !n.isRead && handleMarkOneRead(n.id)}
                    className={`flex items-start gap-3 p-4 transition-colors cursor-pointer ${
                    i < notifications.length - 1 ? "border-b border-border" : ""
                    } ${!n.isRead ? "bg-primary/5" : "hover:bg-card"}`}
                >
                    {/* Icon */}
                    <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getIconBg(n.type)}`}
                    >
                    {getIcon(n.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <p
                        className={`text-sm font-semibold text-heading ${
                            !n.isRead ? "font-bold" : ""
                        }`}
                        >
                        {n.title}
                        </p>
                        {!n.isRead && (
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                        )}
                    </div>
                    <p className="text-xs text-secondary mt-0.5 leading-relaxed">
                        {n.message}
                    </p>
                    <p className="text-xs text-secondary mt-1">
                        {new Date(n.createdAt).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        })}
                    </p>
                    </div>
                </motion.div>
                ))}
            </AnimatePresence>
            )}
        </motion.div>
        </div>
    );
}