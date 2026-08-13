"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Shield, Zap, RefreshCw, Smartphone, Wifi, ArrowDownToLine, } from "lucide-react";

// Count up hook
function useCountUp(target: number, duration = 2000, inView = false) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let startTime: number;
        const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * target));
        if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [inView, target, duration]);

    return count;
}

// Individual stat with count up
function StatItem({
    value,
    label,
    prefix = "",
    suffix = "",
    inView,
    }: {
    value: number;
    label: string;
    prefix?: string;
    suffix?: string;
    inView: boolean;
    }) {
    const count = useCountUp(value, 2000, inView);
    return (
        <div>
            <p className="text-2xl font-black text-heading">
                {prefix}{count.toLocaleString()}{suffix}
            </p>

            <p className="text-sm text-secondary mt-1">{label}</p>
        </div>
    );
}

export default function HeroSection() {
    const statsRef = useRef(null);
    const inView = useInView(statsRef, { once: true });

    return (
        <section className="min-h-screen flex items-center pt-17.5 px-8 bg-background grid-bg">
            <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center py-10">

                {/* Left — text */}
                <div>
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-4 py-2 rounded-full mb-5"
                    >
                        <Zap size={12} fill="currentColor" />
                            Simple. Fast. Secure.
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-6xl font-black text-heading leading-tight tracking-tight mb-5"
                    >
                        Recharge.{" "}
                        <span className="gradient-text">Convert.</span>{" "}
                        Withdraw.
                    </motion.h1>

                    {/* Subtext */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-secondary text-lg leading-relaxed mb-7 max-w-md"
                    >
                        Nigeria&apos;s fastest airtime-to-cash platform. Buy airtime,
                        purchase data, and convert excess airtime to real cash -
                        directly to your bank account.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex items-center gap-4 flex-wrap mb-10"
                    >
                        <Link href="/auth/register" className="no-underline">
                            <button className="btn-primary flex items-center gap-2 px-6 py-3 text-base">
                                Start for Free <ArrowRight size={18} />
                            </button>
                        </Link>

                        <Link href="/auth/login" className="no-underline">
                            <button className="btn-secondary flex items-center gap-2 px-6 py-3 text-base">
                                Log In
                            </button>
                        </Link>
                    </motion.div>

                    {/* Trust stats with count up */}
                    <motion.div
                        ref={statsRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex items-center gap-10 flex-wrap"
                    >
                        <StatItem
                            value={50}
                            suffix="K+"
                            label="Active Users"
                            inView={inView}
                        />

                        <StatItem
                            value={2}
                            prefix="₦"
                            suffix="B+"
                            label="Processed"
                            inView={inView}
                        />
                        <div>
                            <p className="text-2xl font-black text-heading">&lt; 2min</p>
                            <p className="text-sm text-secondary mt-1">Conversion</p>
                        </div>
                    </motion.div>
                </div>

                {/* Right — floating card */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="hidden md:flex justify-center"
                >
                    <motion.div
                        animate={{ y: [0, -12, 0] }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-border"
                    >
                        {/* Card header */}
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-secondary font-medium">
                                Wallet Balance
                            </p>

                            <div className="flex items-center gap-1 text-success text-xs font-semibold">
                                <Shield size={12} />
                                Secured
                            </div>
                        </div>

                        <p className="text-4xl font-black text-heading mb-1">
                            &#8358;24,500
                            <span className="text-xl text-secondary">.00</span>
                        </p>

                        <p className="text-sm text-secondary mb-6">
                            +&#8358;3,200 this week
                        </p>

                        {/* Quick actions */}
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            {[
                                {
                                label: "Buy Airtime",
                                icon: Smartphone,
                                color: "bg-blue-50",
                                iconColor: "text-blue-500",
                                },
                                {
                                label: "Buy Data",
                                icon: Wifi,
                                color: "bg-purple-50",
                                iconColor: "text-purple-500",
                                },
                                {
                                label: "Convert",
                                icon: RefreshCw,
                                color: "bg-red-50",
                                iconColor: "text-primary",
                                },
                                {
                                label: "Withdraw",
                                icon: ArrowDownToLine,
                                color: "bg-green-50",
                                iconColor: "text-success",
                                },
                            ].map((action) => (
                                <div
                                    key={action.label}
                                    className={`${action.color} rounded-xl p-3 cursor-pointer hover:opacity-80 transition-opacity`}
                                >
                                    <action.icon
                                        size={20}
                                        className={`${action.iconColor} mb-2`}
                                    />
                                    <p className="text-xs text-heading font-semibold">
                                        {action.label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Recent transaction */}
                        <div className="flex items-center gap-3 bg-card rounded-xl p-3">
                            <div className="w-9 h-9 bg-success/10 rounded-full flex items-center justify-center">
                                <RefreshCw size={15} className="text-success" />
                            </div>

                            <div className="flex-1">
                                <p className="text-sm font-semibold text-heading">
                                    Airtime Converted
                                </p>
                                
                                <p className="text-xs text-secondary">MTN · 2 mins ago</p>
                            </div>
                            <span className="text-sm font-bold text-success">
                                +₦1,800
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}