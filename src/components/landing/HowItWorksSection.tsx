"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { UserPlus, Smartphone, ArrowRightLeft, ShieldCheck, Banknote, } from "lucide-react";

const steps = [
    {
        icon: UserPlus,
        step: "01",
        title: "Create Your Account",
        desc: "Sign up in 60 seconds. Verify your email and phone. Your wallet is ready instantly.",
        color: "text-blue-500",
        bg: "bg-blue-50",
    },
    {
        icon: Smartphone,
        step: "02",
        title: "Choose Your Network",
        desc: "Pick MTN, Airtel, Glo or 9mobile. Enter the airtime amount you want to convert.",
        color: "text-purple-500",
        bg: "bg-purple-50",
    },
    {
        icon: ArrowRightLeft,
        step: "03",
        title: "Transfer Airtime",
        desc: "Send your airtime to our dedicated number. Takes less than 30 seconds to complete.",
        color: "text-primary",
        bg: "bg-red-50",
    },
    {
        icon: ShieldCheck,
        step: "04",
        title: "Get Verified",
        desc: "Our system verifies the transfer automatically. Cash hits your wallet in under 2 minutes.",
        color: "text-yellow-500",
        bg: "bg-yellow-50",
    },
    {
        icon: Banknote,
        step: "05",
        title: "Withdraw to Bank",
        desc: "Move your naira to any Nigerian bank account. Fast, secure and always confirmed.",
        color: "text-success",
        bg: "bg-green-50",
    },
];

export default function HowItWorksSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <section
        id="how-it-works"
        className="py-20 px-8 bg-card border-t border-border"
        >
            <div className="max-w-6xl mx-auto">

                {/* Heading */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-4 py-2 rounded-full mb-4 uppercase tracking-wide">
                        How It Works
                    </span>

                    <h2 className="text-4xl md:text-5xl font-black text-heading tracking-tight mb-4">
                        From airtime to cash in{" "}
                        <span className="gradient-text">5 simple steps.</span>
                    </h2>

                    <p className="text-secondary text-lg max-w-xl mx-auto leading-relaxed">
                        No paperwork. No waiting days. Just a fast transparent
                        process you can track end to end.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-7 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />

                    <div className="flex flex-col gap-10">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className={`relative flex items-start gap-6 md:w-[45%] ${
                                i % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
                                }`}
                            >
                                {/* Step circle */}
                                <div
                                className={`w-14 h-14 min-w-14 ${step.bg} rounded-full flex flex-col items-center justify-center z-10 border-2 border-background shadow-sm`}
                                >
                                <step.icon
                                    size={20}
                                    className={step.color}
                                    strokeWidth={1.8}
                                />
                                </div>

                                {/* Content */}
                                <div className="card flex-1 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                                    <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1 block">
                                        Step {step.step}
                                    </span>

                                    <h3 className="text-lg font-bold text-heading mb-2">
                                        {step.title}
                                    </h3>

                                    <p className="text-secondary text-sm leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}