"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAuthStore } from "@/store/auth.store";
import { dataApi } from "@/lib/api";
import { Wifi, CheckCircle, Loader, ArrowRight } from "lucide-react";

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

    interface DataPlan {
    code: string;
    name: string;
    amount: number;
    }

    export default function DataPage() {
    const { user } = useAuthStore();
    const [network, setNetwork] = useState("");
    const [phone, setPhone] = useState("");
    const [plans, setPlans] = useState<DataPlan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null);
    const [loadingPlans, setLoadingPlans] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [reference, setReference] = useState("");

    // Fetch plans when network changes
    useEffect(() => {
        if (!network) return;
        const fetchPlans = async () => {
        setLoadingPlans(true);
        setSelectedPlan(null);
        try {
            const { data } = await dataApi.getPlans(network);
            setPlans(data.data!);
        } catch {
            setError("Failed to fetch data plans.");
        } finally {
            setLoadingPlans(false);
        }
        };
        fetchPlans();
    }, [network]);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedPlan) return;
        setLoading(true);
        setError("");

        try {
        const { data } = await dataApi.buy({
            network,
            phone,
            planCode: selectedPlan.code,
        });
        setReference(data.data?.reference ?? "");
        setSuccess(true);
        } catch (err: any) {
        setError(
            err?.response?.data?.message ?? "Data purchase failed. Please try again."
        );
        } finally {
        setLoading(false);
        }
    };

    const handleReset = () => {
        setSuccess(false);
        setNetwork("");
        setPhone("");
        setPlans([]);
        setSelectedPlan(null);
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
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                        <Wifi size={20} className="text-purple-500" strokeWidth={1.8} />
                    </div>

                    <h1 className="text-2xl font-black text-heading">Buy Data</h1>
                </div>
                <p className="text-secondary text-sm">
                Purchase data bundles for any Nigerian network
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
                            Data Purchased!
                        </h2>

                        <p className="text-secondary text-sm mb-1">
                            {selectedPlan?.name} {network} data sent to
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

                {/* Data plans */}
                {network && (
                    <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    >
                    <label className="block text-xs font-bold text-heading uppercase tracking-wide mb-3">
                        Select Plan
                    </label>
                    {loadingPlans ? (
                        <div className="flex items-center justify-center py-8">
                        <Loader
                            size={24}
                            className="animate-spin text-primary"
                        />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                        {plans.map((plan) => (
                            <button
                            key={plan.code}
                            type="button"
                            onClick={() => setSelectedPlan(plan)}
                            className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer bg-transparent text-left ${
                                selectedPlan?.code === plan.code
                                ? "bg-primary/10 border-primary"
                                : "border-border hover:border-primary/30"
                            }`}
                            >
                            <div>
                                <p
                                className={`text-sm font-semibold ${
                                    selectedPlan?.code === plan.code
                                    ? "text-primary"
                                    : "text-heading"
                                }`}
                                >
                                {plan.name}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span
                                className={`text-sm font-bold ${
                                    selectedPlan?.code === plan.code
                                    ? "text-primary"
                                    : "text-heading"
                                }`}
                                >
                                ₦{plan.amount.toLocaleString()}
                                </span>
                                {selectedPlan?.code === plan.code && (
                                <CheckCircle
                                    size={16}
                                    className="text-primary"
                                />
                                )}
                            </div>
                            </button>
                        ))}
                        </div>
                    )}
                    </motion.div>
                )}

                {/* Summary */}
                {network && phone && selectedPlan && (
                    <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-xl p-4 text-sm"
                    >
                    <p className="text-secondary mb-1">Summary</p>
                    <p className="text-heading font-semibold">
                        Sending{" "}
                        <span className="text-primary">{selectedPlan.name}</span>{" "}
                        {network} data to{" "}
                        <span className="text-primary">{phone}</span> for{" "}
                        <span className="text-primary">
                        ₦{selectedPlan.amount.toLocaleString()}
                        </span>
                    </p>
                    </motion.div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading || !network || !phone || !selectedPlan}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                    <Loader size={18} className="animate-spin" />
                    ) : (
                    <>
                        Buy Data <ArrowRight size={18} />
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