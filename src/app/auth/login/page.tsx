"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import AuthNavbar from "@/components/layout/AuthNavbar";


export default function LoginPage() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const [form, setForm] = useState({
        emailOrPhone: "",
        password: "",
    });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const searchParams = useSearchParams();
    const registered = searchParams.get("registered");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value.trim() });
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
        const user = await login(form.emailOrPhone, form.password);
        if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
            router.push("/admin");
        } else {
            router.push("/dashboard");
        }
        } catch (err: any) {
        setError(
            err?.response?.data?.message ?? "Login failed. Please try again."
        );
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 pt-22.5">
        <AuthNavbar />

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-full max-w-md card"
            >
                <h1 className="text-2xl font-black text-heading mb-1">
                    Welcome back!
                </h1>

                <p className="text-secondary text-sm mb-8">
                    Log in to your CloudNine Pay account
                </p>

                {/* Success message after registration */}
                {registered && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl mb-6"
                    >
                        Account created successfully! Please log in. 
                    </motion.div>
                )}

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

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Email or Phone */}
                    <div>
                        <label className="block text-xs font-bold text-heading uppercase tracking-wide mb-2">
                            Email or Phone Number
                        </label>

                        <input
                            type="text"
                            name="emailOrPhone"
                            value={form.emailOrPhone}
                            onChange={handleChange}
                            placeholder="Email or phone number"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-bold text-heading uppercase tracking-wide">
                                Password
                            </label>

                            <Link
                                href="/auth/forgot-password"
                                className="text-xs text-primary no-underline hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <div className="relative">
                            <input
                                type={showPass ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                className="pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-heading bg-transparent border-none cursor-pointer"
                            >
                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
                    >
                        {loading ? (
                        <Loader size={18} className="animate-spin" />
                        ) : (
                        <>
                            Log In <ArrowRight size={18} />
                        </>
                        )}
                    </button>
                </form>

                {/* Register link */}
                <p className="text-center text-sm text-secondary mt-6">
                Don&apos;t have an account?{" "}
                <Link
                    href="/auth/register"
                    className="text-primary font-semibold no-underline hover:underline"
                >
                    Create one
                </Link>
                </p>
            </motion.div>
        </div>
    );
}