"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAuthStore } from "@/store/auth.store";
import { airtimeApi } from "@/lib/api";
import { Smartphone, CheckCircle, Loader, ArrowRight } from "lucide-react";

const networks = [
    {
        id: "MTN",
        name: "MTN",
        logo: "/mtn.svg",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
    },
    {
        id: "AIRTEL",
        name: "Airtel",
        logo: "/airtel.svg",
        bg: "bg-red-50",
        border: "border-red-200",
    },
    {
        id: "GLO",
        name: "Glo",
        logo: "/glo.svg",
        bg: "bg-green-50",
        border: "border-green-200",
    },
    {
        id: "NINE_MOBILE",
        name: "9mobile",
        logo: "/9mobile.svg",
        bg: "bg-cyan-50",
        border: "border-cyan-200",
    },
];

const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

export default function AirtimePage() {
    const { user } = useAuthStore();
    const [network, setNetwork] = useState("");
    const [phone, setPhone] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [reference, setReference] = useState("");

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
        const { data } = await airtimeApi.buy({
            network,
            phone,
            amount: Number(amount),
        });
        setReference(data.data?.reference ?? "");
        setSuccess(true);
        } catch (err: any) {
        setError(
            err?.response?.data?.message ?? "Airtime purchase failed. Please try again."
        );
        } finally {
        setLoading(false);
        }
    };

    const handleReset = () => {
        setSuccess(false);
        setNetwork("");
        setPhone("");
        setAmount("");
        setReference("");
        setError("");
    };

    return (
        <div className="max-w-lg mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Smartphone size={20} className="text-blue-500" strokeWidth={1.8} />
                    </div>

                    <h1 className="text-2xl font-black text-heading">Buy Airtime</h1>
                </div>

                <p className="text-secondary text-sm ml-13">
                    Top up any Nigerian network instantly
                </p>
            </motion.div>

            <AnimatePresence mode="wait">
                {success ? (
                    /* Success state */
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="card text-center py-10"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                            className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                            <CheckCircle size={32} className="text-success" />
                        </motion.div>

                        <h2 className="text-xl font-black text-heading mb-2">
                            Airtime Sent! 
                        </h2>

                        <p className="text-secondary text-sm mb-1">
                            &#8358;{Number(amount).toLocaleString()} {network} airtime sent to
                        </p>

                        <p className="text-heading font-bold mb-1">{phone}</p>

                        <p className="text-secondary text-xs mb-6">
                            Ref: {reference}
                        </p>

                        <button
                            onClick={handleReset}
                            className="btn-primary px-8 py-2.5"
                        >
                            Buy Again
                        </button>
                    </motion.div>

                ) : (
                    /* Form */
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="card"
                    >
                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6"
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            {/* Network selection */}
                            <div>
                                <label className="block text-xs font-bold text-heading uppercase tracking-wide mb-3">
                                Select Network
                                </label>

                                <div className="grid grid-cols-2 gap-3">
                                    {networks.map((n) => (
                                        <button
                                            key={n.id}
                                            type="button"
                                            onClick={() => setNetwork(n.id)}
                                            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer bg-transparent ${
                                                network === n.id
                                                ? `${n.bg} ${n.border}`
                                                : "border-border hover:border-primary/30"
                                            }`}
                                        >
                                            <Image
                                                src={n.logo}
                                                alt={n.name}
                                                width={32}
                                                height={32}
                                                className="rounded-lg object-contain"
                                            />
                                            <span
                                                className={`text-sm font-semibold ${
                                                network === n.id ? "text-heading" : "text-secondary"
                                                }`}
                                            >
                                                {n.name}
                                            </span>
                                            {network === n.id && (
                                                <CheckCircle
                                                size={16}
                                                className="text-primary ml-auto"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Phone number */}
                            <div>
                                <label className="block text-xs font-bold text-heading uppercase tracking-wide mb-2">
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(e.target.value.replace(/[^0-9]/g, ""))
                                    }
                                    placeholder="08012345678"
                                    maxLength={11}
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setPhone(user?.phone ?? "")}
                                    className="text-xs text-primary mt-1 bg-transparent border-none cursor-pointer hover:underline"
                                >
                                    Use my number ({user?.phone})
                                </button>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-xs font-bold text-heading uppercase tracking-wide mb-3">
                                    Amount (&#8358;)
                                </label>

                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    {quickAmounts.map((a) => (
                                        <button
                                            key={a}
                                            type="button"
                                            onClick={() => setAmount(String(a))}
                                            className={`py-2 px-3 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                                amount === String(a)
                                                ? "bg-primary/10 border-primary text-primary"
                                                : "border-border text-secondary hover:border-primary/30 bg-transparent"
                                            }`}
                                        >
                                            &#8358;{a.toLocaleString()}
                                        </button>
                                    ))}
                                </div>

                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Or enter custom amount"
                                    min="50"
                                    required
                                />
                            </div>

                            {/* Summary */}
                            {network && phone && amount && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-card border border-border rounded-xl p-4 text-sm"
                                >
                                    <p className="text-secondary mb-1">Summary</p>

                                    <p className="text-heading font-semibold">
                                        Sending{" "}
                                        <span className="text-primary">
                                            &#8358;{Number(amount).toLocaleString()}
                                        </span>{" "}
                                        {network} airtime to{" "}
                                        <span className="text-primary">{phone}</span>
                                    </p>
                                </motion.div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading || !network || !phone || !amount}
                                className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                <Loader size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        Buy Airtime <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}