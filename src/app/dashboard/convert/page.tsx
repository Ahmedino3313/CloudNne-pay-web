"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { conversionApi } from "@/lib/api";
import { ConversionRate } from "@/types";
import { RefreshCw, CheckCircle, Loader, ArrowRight, Info, Copy, Check, } from "lucide-react";

const networkLogos: Record<string, string> = {
    MTN: "/mtn.svg",
    AIRTEL: "/airtel.svg",
    GLO: "/glo.svg",
    NINE_MOBILE: "/9mobile.svg",
};

const networkNames: Record<string, string> = {
    MTN: "MTN",
    AIRTEL: "Airtel",
    GLO: "Glo",
    NINE_MOBILE: "9mobile",
};

type Step = "form" | "transfer" | "success";

export default function ConvertPage() {
    const [rates, setRates] = useState<ConversionRate[]>([]);
    const [network, setNetwork] = useState("");
    const [airtimeAmount, setAirtimeAmount] = useState("");
    const [step, setStep] = useState<Step>("form");
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const [conversionData, setConversionData] = useState<{
        conversionId: string;
        cashValue: number;
        transferNumber: string;
    } | null>(null);

    // Fetch conversion rates on mount
    useEffect(() => {
        const fetchRates = async () => {
        try {
            const { data } = await conversionApi.getRates();
            setRates(data.data!);
        } catch {
            // ignore
        }
        };
        fetchRates();
    }, []);

    const selectedRate = rates.find((r) => r.network === network);
    const estimatedCash = selectedRate && airtimeAmount
        ? Math.floor(Number(airtimeAmount) * selectedRate.rate)
        : 0;

    const handleInitiate = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
        const { data } = await conversionApi.initiate({
            network,
            airtimeAmount: Number(airtimeAmount),
        });
        setConversionData({
            conversionId: data.data!.conversionId,
            cashValue: data.data!.cashValue,
            transferNumber: data.data!.transferNumber,
        });
        setStep("transfer");
        } catch (err: any) {
        setError(
            err?.response?.data?.message ?? "Failed to initiate conversion."
        );
        } finally {
        setLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!conversionData) return;
        setVerifying(true);
        setError("");

        try {
        await conversionApi.verify(conversionData.conversionId);
        setStep("success");
        } catch (err: any) {
        setError(
            err?.response?.data?.message ?? "Verification failed. Please try again."
        );
        } finally {
        setVerifying(false);
        }
    };

    const handleCopy = () => {
        if (!conversionData) return;
        navigator.clipboard.writeText(conversionData.transferNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReset = () => {
        setStep("form");
        setNetwork("");
        setAirtimeAmount("");
        setConversionData(null);
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
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                        <RefreshCw size={20} className="text-primary" strokeWidth={1.8} />
                    </div>

                    <h1 className="text-2xl font-black text-heading">
                        Convert Airtime
                    </h1>
                </div>

                <p className="text-secondary text-sm">
                    Turn your excess airtime into real cash
                </p>
            </motion.div>

            <AnimatePresence mode="wait">
                {/* STEP 1 — Form */}
                {step === "form" && (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="card"
                    >
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleInitiate} className="flex flex-col gap-6">
                            {/* Network selection */}
                            <div>
                                <label className="block text-xs font-bold text-heading uppercase tracking-wide mb-3">
                                    Select Network
                                </label>

                                <div className="grid grid-cols-2 gap-3">
                                    {rates.map((r) => (
                                        <button
                                            key={r.network}
                                            type="button"
                                            onClick={() => setNetwork(r.network)}
                                            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer bg-transparent ${
                                                network === r.network
                                                ? "bg-primary/10 border-primary"
                                                : "border-border hover:border-primary/30"
                                            }`}
                                        >       
                                            <Image
                                                src={networkLogos[r.network]}
                                                alt={r.network}
                                                width={32}
                                                height={32}
                                                className="rounded-lg object-contain"
                                            />

                                            <div className="text-left">
                                                <p
                                                    className={`text-sm font-semibold ${
                                                        network === r.network
                                                        ? "text-heading"
                                                        : "text-secondary"
                                                    }`}
                                                >
                                                    {networkNames[r.network]}
                                                </p>

                                                    <p className="text-xs text-secondary">
                                                        {(r.rate * 100).toFixed(0)}% rate
                                                    </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-xs font-bold text-heading uppercase tracking-wide mb-2">
                                Airtime Amount (&#8358;)
                                </label>

                                <input
                                    type="number"
                                    value={airtimeAmount}
                                    onChange={(e) => setAirtimeAmount(e.target.value)}
                                    placeholder="Min ₦500"
                                    min="500"
                                    required
                                />
                            </div>

                            {/* Estimated cash */}
                            {estimatedCash > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between"
                                >
                                    <div>
                                        <p className="text-xs text-secondary mb-1">
                                        You&apos;ll receive
                                        </p>

                                        <p className="text-2xl font-black text-success">
                                            &#8358;{estimatedCash.toLocaleString()}
                                        </p>
                                    </div>
                                        
                                    <div className="text-right">
                                        <p className="text-xs text-secondary mb-1">Rate</p>
                                        
                                        <p className="text-sm font-bold text-heading">
                                            {selectedRate ? (selectedRate.rate * 100).toFixed(0) : 0}%
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !network || !airtimeAmount}
                                className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        Continue <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                )}

                {/* STEP 2 — Transfer instructions */}
                {step === "transfer" && conversionData && (
                    <motion.div
                        key="transfer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="card"
                    >
                        <div className="flex items-center gap-2 mb-5">
                            <Info size={16} className="text-yellow-500" />

                            <h2 className="text-base font-bold text-heading">
                                Transfer Airtime Now
                            </h2>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
                                {error}
                            </div>
                        )}

                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-5">
                            <p className="text-sm text-secondary mb-2">
                                Send <span className="font-bold text-heading">
                                &#8358;{Number(airtimeAmount).toLocaleString()} airtime
                                </span> to:
                            </p>

                            <div className="flex items-center gap-3 mb-2">
                                <p className="text-3xl font-black text-heading tracking-wider">
                                    {conversionData.transferNumber}
                                </p>

                                <button
                                    onClick={handleCopy}
                                    className="text-secondary hover:text-primary bg-transparent border-none cursor-pointer transition-colors"
                                >
                                    {copied ? (
                                        <Check size={18} className="text-success" />
                                    ) : (
                                        <Copy size={18} />
                                    )}
                                </button>
                            </div>

                            <p className="text-xs text-secondary">
                                {networkNames[network]} network · Expires in 10 minutes
                            </p>
                        </div>

                        <p className="text-sm text-secondary mb-5">
                            After transferring, click the button below. We&apos;ll verify it
                            and credit{" "}
                            <span className="font-bold text-success">
                                &#8358;{conversionData.cashValue.toLocaleString()}
                            </span>{" "}
                            to your wallet.
                        </p>

                        <button
                            onClick={handleVerify}
                            disabled={verifying}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold bg-success hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer border-none"
                        >
                            {verifying ? (
                                <>
                                    <Loader size={18} className="animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "I've Transferred — Verify Now"
                            )}
                        </button>

                        <button
                            onClick={handleReset}
                            className="btn-secondary w-full mt-3"
                        >
                            Go Back
                        </button>
                    </motion.div>
                )}

                {/* STEP 3 — Success */}
                {step === "success" && conversionData && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
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
                            Conversion Successful!
                        </h2>

                        <p className="text-secondary text-sm mb-1">
                            &#8358;{conversionData.cashValue.toLocaleString()} has been added to
                            your wallet
                        </p>

                        <p className="text-secondary text-xs mb-6">
                            Converted from  &#8358;{Number(airtimeAmount).toLocaleString()}{" "}
                            {networkNames[network]} airtime
                        </p>

                        <button onClick={handleReset} className="btn-primary px-8 py-2.5">
                            Convert Again
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}