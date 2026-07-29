"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { adminApi, conversionApi } from "@/lib/api";
import { ConversionRate } from "@/types";
import { Settings, RefreshCw, CheckCircle, Loader, Save, } from "lucide-react";
import { SkeletonBlock } from "@/components/ui/SkeletonLoader";
import Image from "next/image";

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

export default function AdminSettingsPage() {
    const [rates, setRates] = useState<ConversionRate[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [successId, setSuccessId] = useState<string | null>(null);
    const [editedRates, setEditedRates] = useState<Record<string, string>>({});

    const { user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
    if (user && user.role !== "SUPER_ADMIN") {
        router.push("/admin");
    }
    }, [user, router]);

    useEffect(() => {
        const fetchRates = async () => {
        try {
            const { data } = await conversionApi.getRates();
            const fetchedRates = data.data ?? [];
            setRates(fetchedRates);

            // Initialize edited rates with current values
            const initial: Record<string, string> = {};
            fetchedRates.forEach((r: ConversionRate) => {
            initial[r.network] = (r.rate * 100).toFixed(0);
            });
            setEditedRates(initial);
        } catch {
            setRates([]);
        } finally {
            setLoading(false);
        }
        };
        fetchRates();
    }, []);

    const handleSaveRate = async (network: string) => {
        const newRate = Number(editedRates[network]) / 100;

        if (newRate < 0 || newRate > 1) return;

        setSavingId(network);
        try {
        await adminApi.updateRate({ network, rate: newRate });
        setRates((prev) =>
            prev.map((r) =>
            r.network === network ? { ...r, rate: newRate } : r
            )
        );
        setSuccessId(network);
        setTimeout(() => setSuccessId(null), 2000);
        } catch {
        // ignore
        } finally {
        setSavingId(null);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-card border border-border rounded-xl flex items-center justify-center">
                <Settings size={20} className="text-primary" strokeWidth={1.8} />
            </div>
            <h1 className="text-2xl font-black text-heading">
                Platform Settings
            </h1>
            </div>
            <p className="text-secondary text-sm">
            Manage conversion rates and platform configuration
            </p>
        </motion.div>

        {/* Conversion rates */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
        >
            <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                <RefreshCw size={18} className="text-primary" />
            </div>
            <div>
                <h2 className="text-base font-bold text-heading">
                Airtime Conversion Rates
                </h2>
                <p className="text-xs text-secondary">
                Set the percentage users receive when converting airtime
                </p>
            </div>
            </div>

            {loading ? (
            <div className="flex flex-col gap-4">
                {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                    <SkeletonBlock className="w-10 h-10 rounded-xl" />
                    <div className="flex-1">
                    <SkeletonBlock className="w-24 h-5 mb-1" />
                    <SkeletonBlock className="w-16 h-3" />
                    </div>
                    <SkeletonBlock className="w-28 h-10 rounded-xl" />
                    <SkeletonBlock className="w-16 h-10 rounded-xl" />
                </div>
                ))}
            </div>
            ) : (
            <div className="flex flex-col gap-4">
                {rates.map((r) => (
                <motion.div
                    key={r.network}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl"
                >
                    {/* Network logo */}
                    <Image
                    src={networkLogos[r.network]}
                    alt={networkNames[r.network]}
                    width={36}
                    height={36}
                    className="rounded-lg object-contain"
                    />

                    {/* Network name and current rate */}
                    <div className="flex-1">
                    <p className="text-sm font-bold text-heading">
                        {networkNames[r.network]}
                    </p>
                    <p className="text-xs text-secondary">
                        Current: {(r.rate * 100).toFixed(0)}%
                    </p>
                    </div>

                    {/* Rate input */}
                    <div className="flex items-center gap-2">
                    <div className="relative">
                        <input
                        type="number"
                        value={editedRates[r.network] ?? ""}
                        onChange={(e) =>
                            setEditedRates((prev) => ({
                            ...prev,
                            [r.network]: e.target.value,
                            }))
                        }
                        min="0"
                        max="100"
                        className="w-24 text-center pr-8"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary text-sm">
                        %
                        </span>
                    </div>

                    {/* Save button */}
                    <button
                        onClick={() => handleSaveRate(r.network)}
                        disabled={
                        savingId === r.network ||
                        editedRates[r.network] ===
                            (r.rate * 100).toFixed(0)
                        }
                        className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-none bg-primary text-white hover:opacity-90"
                    >
                        {savingId === r.network ? (
                        <Loader size={14} className="animate-spin" />
                        ) : successId === r.network ? (
                        <CheckCircle size={14} />
                        ) : (
                        <Save size={14} />
                        )}
                        {successId === r.network ? "Saved!" : "Save"}
                    </button>
                    </div>
                </motion.div>
                ))}
            </div>
            )}

            {/* Info note */}
            <div className="mt-5 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-xs text-yellow-700">
                ⚠️ Changing conversion rates affects all new conversions
                immediately. Users currently in the conversion flow will use
                the old rate.
            </p>
            </div>
        </motion.div>
        </div>
    );
}