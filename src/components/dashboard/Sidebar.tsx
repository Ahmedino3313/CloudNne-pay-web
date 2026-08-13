"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { LayoutDashboard, Smartphone, Wifi, RefreshCw, ArrowDownToLine, Clock, Bell, Settings, LogOut, Menu, X, ChevronLeft, ChevronRight, ShieldCheck, Users, TrendingUp, Activity, Shield, } from "lucide-react";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Smartphone, label: "Buy Airtime", href: "/dashboard/airtime" },
    { icon: Wifi, label: "Buy Data", href: "/dashboard/data" },
    { icon: RefreshCw, label: "Convert Airtime", href: "/dashboard/convert" },
    { icon: ArrowDownToLine, label: "Withdraw", href: "/dashboard/withdraw" },
    { icon: Clock, label: "Transactions", href: "/dashboard/transactions" },
    { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.push("/auth/login");
    };

    const SidebarContent = () => {
    const adminNavItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/admin" },
        { icon: Users, label: "Users", href: "/admin/users" },
        { icon: ArrowDownToLine, label: "Withdrawals", href: "/admin/withdrawals" },
        { icon: TrendingUp, label: "Revenue", href: "/admin/revenue" },
        { icon: Activity, label: "App Health", href: "/admin/health" },
        {icon: Shield, label: "Audit Logs", href: "/admin/audit-logs" },
        ...(user?.role === "SUPER_ADMIN"
            ? [{ icon: Settings, label: "Settings", href: "/admin/settings" }]
            : []),
        ];

        return (
                <div className="flex flex-col h-full">

                {/* Logo */}
                <div className={`flex items-center gap-3 p-6 border-b border-border ${collapsed ? "justify-center" : ""}`}>
                    <Image
                        src="/logo.jpeg"
                        alt="CloudNine Pay"
                        width={32}
                        height={32}
                        className="rounded-lg object-contain min-w-8"
                    />
                    {!collapsed && (
                        <span className="text-base font-bold text-heading">
                            CloudNine<span className="text-primary">Pay</span>
                        </span>
                    )}
                </div>

                {/* Nav items */}
                <div className="flex-1 p-3 overflow-y-auto">
                    {!collapsed && (
                        <p className="text-xs font-bold text-secondary uppercase tracking-widest px-3 mb-3">
                        {pathname.startsWith("/admin") ? "Admin Menu" : "Main Menu"}
                        </p>
                    )}
                    <div className="flex flex-col gap-1">
                        {(pathname.startsWith("/admin") ? adminNavItems : navItems).map(
                        (item) => {
                            const active = pathname === item.href;
                            return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                title={collapsed ? item.label : ""}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline transition-all duration-200 ${
                                collapsed ? "justify-center" : ""
                                } ${
                                active
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "text-secondary hover:bg-card hover:text-heading"
                                }`}
                            >
                                <item.icon
                                size={18}
                                strokeWidth={active ? 2.5 : 1.8}
                                />
                                {!collapsed && (
                                <span
                                    className={`text-sm ${
                                    active ? "font-semibold" : "font-medium"
                                    }`}
                                >
                                    {item.label}
                                </span>
                                )}
                                {active && !collapsed && (
                                <div className="w-1.5 h-1.5 rounded-full bg-primary ml-auto" />
                                )}
                            </Link>
                            );
                        }
                        )}

                        {/* Switch to dashboard link when in admin */}
                        {pathname.startsWith("/admin") && (
                        <Link
                            href="/dashboard"
                            title={collapsed ? "Go to Dashboard" : ""}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline transition-all duration-200 text-secondary hover:bg-card hover:text-heading ${
                            collapsed ? "justify-center" : ""
                            }`}
                        >
                            <LayoutDashboard size={18} strokeWidth={1.8} />
                            {!collapsed && (
                                <span className="text-sm font-medium">Go to Dashboard</span>
                            )}
                        </Link>
                        )}

                        {/* Admin link when in dashboard */}
                        {!pathname.startsWith("/admin") &&
                        (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
                            <Link
                            href="/admin"
                            title={collapsed ? "Admin Panel" : ""}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline transition-all duration-200 text-secondary hover:bg-card hover:text-heading ${
                                collapsed ? "justify-center" : ""
                            }`}
                            >
                            <ShieldCheck size={18} strokeWidth={1.8} />
                            {!collapsed && (
                                <span className="text-sm font-medium">Admin Panel</span>
                            )}
                            </Link>
                        )}
                    </div>
                </div>

                {/* User info and logout */}
                <div className="p-3 border-t border-border">
                    <div className={`flex items-center gap-3 p-3 rounded-xl bg-card border border-border mb-2 ${collapsed ? "justify-center" : ""}`}>
                        
                        {/* Avatar */}
                        <div className="w-8 h-8 min-w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                            {user?.fullName?.charAt(0) ?? "U"}
                        </div>

                        {!collapsed && (
                            <>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-heading truncate">
                                        {user?.fullName}
                                    </p>

                                    <p className="text-xs text-secondary capitalize">
                                        {user?.role?.toLowerCase().replace("_", " ")}
                                    </p>
                                </div>
                                
                                <button
                                    onClick={handleLogout}
                                    className="text-secondary hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
                                    title="Logout"
                                >
                                    <LogOut size={16} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Collapse button — desktop only */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden md:flex w-full items-center justify-center p-2 rounded-xl text-secondary hover:text-heading hover:bg-card transition-all duration-200 bg-transparent border border-border cursor-pointer"
                    >
                        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Desktop sidebar */}
            <motion.aside
                animate={{ width: collapsed ? 72 : 240 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden md:flex flex-col bg-background border-r border-border h-screen sticky top-0 overflow-hidden shrink-0"
            >
                <SidebarContent />
            </motion.aside>

            {/* Mobile top bar */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-15 bg-background border-b border-border flex items-center justify-between px-4 z-40">
                <span className="text-base font-bold text-heading">
                    CloudNine<span className="text-primary">Pay</span>
                </span>

                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="bg-transparent border-none text-heading cursor-pointer p-2"
                    >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            key="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="md:hidden fixed inset-0 bg-black/40 z-40"
                        />
                        
                        <motion.div
                            key="drawer"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="md:hidden fixed top-0 right-0 bottom-0 w-70 bg-background z-50 flex flex-col shadow-2xl"
                        >
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}