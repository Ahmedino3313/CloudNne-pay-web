"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader, Check } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import AuthNavbar from "@/components/layout/AuthNavbar";

export default function RegisterPage() {
    const router = useRouter();
    const register = useAuthStore((state) => state.register);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
    });
    const [showPass, setShowPass] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        let sanitized = value;

        if (name === "password") {
            // Don't touch password while typing
            sanitized = value;
        } else if (name === "fullName") {
            // Strip HTML tags, collapse extra spaces, only allow letters and spaces
            sanitized = value
            .replace(/<[^>]*>/g, "") // remove any HTML tags
            .replace(/[^a-zA-Z\s'-]/g, "") // only allow letters, spaces, hyphens and apostrophes
            .replace(/\s+/g, " ") // collapse multiple spaces into one
            .trimStart(); // remove leading spaces
        } else if (name === "email") {
            // Remove spaces and HTML tags
            sanitized = value
            .replace(/<[^>]*>/g, "")
            .replace(/\s/g, "");
        } else if (name === "phone") {
            // Only allow numbers
            sanitized = value.replace(/[^0-9]/g, "");
        }

        setForm({ ...form, [name]: sanitized });
    };

    // Password strength checker
    const getStrength = () => {
        const { password } = form;
        if (password.length === 0) return null;
        if (password.length < 6) return "weak";
        if (
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[0-9]/.test(password)
        )
        return "strong";
        return "medium";
    };

    const strength = getStrength();

    const strengthConfig = {
        weak: { label: "Weak", color: "bg-red-400", width: "w-1/3" },
        medium: { label: "Medium", color: "bg-yellow-400", width: "w-2/3" },
        strong: { label: "Strong", color: "bg-success", width: "w-full" },
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!agreed) {
            setError("Please agree to the Terms of Service and Privacy Policy.");
            return;
        }
        setLoading(true);
        setError("");

        try {
            await register(form);
            // Redirect to login after successful registration
            router.push("/auth/login?registered=true");
        } catch (err: any) {
            setError(
            err?.response?.data?.message ?? "Registration failed. Please try again."
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
                    Create account 
                </h1>

                <p className="text-secondary text-sm mb-8">
                    Join 50,000+ Nigerians already using CloudNine Pay
                </p>

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

                    {/* Full Name */}
                    <div>
                        <label className="block text-xs font-bold text-heading uppercase tracking-wide mb-2">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-bold text-heading uppercase tracking-wide mb-2">
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-xs font-bold text-heading uppercase tracking-wide mb-2">
                            Phone Number
                        </label>

                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-bold text-heading uppercase tracking-wide mb-2">
                            Password
                        </label>

                        <div className="relative">

                            <input
                                type={showPass ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Min. 8 characters"
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

                        {/* Password strength bar */}
                        {strength && (
                            <div className="mt-2">
                                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        className={`h-full rounded-full ${strengthConfig[strength].color} ${strengthConfig[strength].width}`}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>

                                <p className="text-xs text-secondary mt-1">
                                    Password strength:{" "}
                                    <span
                                        className={
                                        strength === "strong"
                                            ? "text-success font-semibold"
                                            : strength === "medium"
                                            ? "text-yellow-500 font-semibold"
                                            : "text-red-500 font-semibold"
                                        }
                                    >
                                        {strengthConfig[strength].label}
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Terms */}
                    <div className="flex items-start gap-3">
                        <button
                            type="button"
                            onClick={() => setAgreed(!agreed)}
                            className={`w-5 h-5 min-w-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                                agreed
                                ? "bg-primary border-primary"
                                : "bg-background border-border hover:border-primary"
                            }`}
                        >
                            {agreed && (
                                <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Check size={12} color="white" strokeWidth={3} />
                                </motion.div>
                            )}
                        </button>

                        <p className="text-sm text-secondary leading-relaxed">
                            I agree to CloudNine Pay&apos;s{" "}
                            <Link
                                href="/terms"
                                className="text-primary no-underline hover:underline"
                            >
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                                href="/privacy"
                                className="text-primary no-underline hover:underline"
                            >
                                Privacy Policy
                            </Link>
                        </p>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={ loading || !agreed || !form.fullName || !form.email || !form.phone || !form.password }
                        className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                        <Loader size={18} className="animate-spin" />
                        ) : (
                        <>
                            Create Account <ArrowRight size={18} />
                        </>
                        )}
                    </button>
                </form>

                {/* Login link */}
                <p className="text-center text-sm text-secondary mt-6">
                    Already have an account?{" "}
                    <Link
                        href="/auth/login"
                        className="text-primary font-semibold no-underline hover:underline"
                    >
                        Log in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}