"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Smartphone, Wifi, RefreshCw, ArrowDownToLine, Bell, ShieldCheck, } from "lucide-react";

const features = [
    {
        icon: Smartphone,
        title: "Buy Airtime Instantly",
        desc: "Top up any Nigerian network — MTN, Airtel, Glo, 9mobile — in under 10 seconds. No delays, no queues.",
        color: "text-blue-500",
        bg: "bg-blue-50",
    },
    {
        icon: Wifi,
        title: "Data Bundles",
        desc: "Choose from daily, weekly or monthly data plans at the best rates. Works on all major networks.",
        color: "text-purple-500",
        bg: "bg-purple-50",
    },
    {
        icon: RefreshCw,
        title: "Airtime to Cash",
        desc: "Convert excess airtime to real naira. Transfer airtime and get credited in under 2 minutes.",
        color: "text-primary",
        bg: "bg-red-50",
    },
    {
        icon: ArrowDownToLine,
        title: "Instant Withdrawals",
        desc: "Withdraw your wallet balance to any Nigerian bank account. Fast, secure and always trackable.",
        color: "text-success",
        bg: "bg-green-50",
    },
    {
        icon: Bell,
        title: "Real-Time Notifications",
        desc: "Get instant alerts for every transaction, conversion status update and withdrawal confirmation.",
        color: "text-yellow-500",
        bg: "bg-yellow-50",
    },
    {
        icon: ShieldCheck,
        title: "Bank-Grade Security",
        desc: "Enterprise-level security designed to keep your funds, personal information, and transactions safe.",
        color: "text-cyan-500",
        bg: "bg-cyan-50",
    },
];

export default function FeaturesSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <section id="features" className="py-20 px-8 bg-background">
            <div className="max-w-6xl mx-auto">

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                    ref={ref}
                >
                    <span className="inline-block bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-4 py-2 rounded-full mb-4 uppercase tracking-wide">
                        Core Features
                    </span>

                    <h2 className="text-4xl md:text-5xl font-black text-heading tracking-tight mb-4">
                        Everything you need,{" "}
                        <span className="gradient-text">nothing you don&apos;t.</span>
                    </h2>

                    <p className="text-secondary text-lg max-w-xl mx-auto leading-relaxed">
                        CloudNine Pay combines secure payments, airtime services, 
                        and digital finance tools into one seamless experience.
                    </p>
                </motion.div>

                {/* Features grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 40 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            whileHover={{ y: -4 }}
                            className="card hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-default"
                        >
                            {/* Icon */}
                            <div className="flex flex-col items-center text-center">
                                <div
                                    className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}
                                >
                                    <feature.icon
                                    size={22}
                                    className={feature.color}
                                    strokeWidth={1.8}
                                    />
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold text-heading mb-2">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="text-secondary text-sm leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}