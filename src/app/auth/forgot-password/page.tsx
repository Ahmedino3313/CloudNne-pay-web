"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Loader, CheckCircle } from "lucide-react";
import AuthNavbar from "@/components/layout/AuthNavbar";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
        await api.post("/auth/forgot-password", { email });
        setSent(true);
        } catch (err: any) {
        setError(
            err?.response?.data?.message ??
            "Failed to send reset email. Please try again."
        );
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 pt-22.5">
        <AuthNavbar />

        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
        >
            {sent ? (
            /* Success state */
            <div className="card text-center py-10">
                <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                <CheckCircle size={32} className="text-success" />
                </motion.div>
                <h2 className="text-xl font-black text-heading mb-2">
                    Check your email!
                </h2>
                <p className="text-secondary text-sm mb-6 max-w-xs mx-auto">
                    We sent a password reset link to{" "}
                <strong className="text-heading">{email}</strong>. Check
                    your inbox and spam folder.
                </p>
                <p className="text-secondary text-xs mb-6">
                    The link expires in 1 hour.
                </p>
                <Link href="/auth/login" className="no-underline">
                <button className="btn-primary px-8 py-2.5">
                    Back to Login
                </button>
                </Link>
            </div>
            ) : (
            /* Form */
            <div className="card">
                {/* Icon */}
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-5">
                <Mail size={22} className="text-primary" />
                </div>

                <h1 className="text-2xl font-black text-heading mb-1">
                    Forgot password?
                </h1>
                <p className="text-secondary text-sm mb-8">
                    Enter your email and we&apos;ll send you a reset link
                </p>

                {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6"
                >
                    {error}
                </motion.div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                    <label className="block text-xs font-bold text-heading uppercase tracking-wide mb-2">
                        Email Address
                    </label>
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    placeholder="Enter email address"
                    required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !email}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                    <Loader size={18} className="animate-spin" />
                    ) : (
                    <>
                        <Mail size={18} />
                        Send Reset Link
                    </>
                    )}
                </button>
                </form>

                <Link
                href="/auth/login"
                className="flex items-center justify-center gap-2 text-sm text-secondary hover:text-heading no-underline mt-6 transition-colors"
                >
                <ArrowLeft size={16} />
                Back to Login
                </Link>
            </div>
            )}
        </motion.div>
        </div>
    );
}