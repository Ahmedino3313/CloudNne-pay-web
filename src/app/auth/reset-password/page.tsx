"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader, CheckCircle, Lock } from "lucide-react";
import AuthNavbar from "@/components/layout/AuthNavbar";
import api from "@/lib/api";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

  const getStrength = () => {
        if (newPassword.length === 0) return null;
        if (newPassword.length < 6) return "weak";
        if (
        newPassword.length >= 8 &&
        /[A-Z]/.test(newPassword) &&
        /[0-9]/.test(newPassword)
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

  const handleSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/reset-password", { token, newPassword });
      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 3000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 pt-22.5">
        <AuthNavbar />
        <div className="card text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-primary" />
          </div>
          <h2 className="text-xl font-black text-heading mb-2">
            Invalid Reset Link
          </h2>
          <p className="text-secondary text-sm mb-6">
            This reset link is invalid or has expired. Please request a
            new one.
          </p>
          <Link href="/auth/forgot-password" className="no-underline">
            <button className="btn-primary px-8 py-2.5">
              Request New Link
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 pt-22.5">
      <AuthNavbar />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {success ? (
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
              Password Reset! 🎉
            </h2>
            <p className="text-secondary text-sm mb-2">
              Your password has been reset successfully.
            </p>
            <p className="text-secondary text-xs mb-6">
              Redirecting to login in 3 seconds...
            </p>
            <Link href="/auth/login" className="no-underline">
              <button className="btn-primary px-8 py-2.5">
                Go to Login
              </button>
            </Link>
          </div>
        ) : (
          <div className="card">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-5">
              <Lock size={22} className="text-primary" />
            </div>

            <h1 className="text-2xl font-black text-heading mb-1">
              Reset Password
            </h1>
            <p className="text-secondary text-sm mb-8">
              Enter your new password below
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
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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

                {strength && (
                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: "100%" }}
                        className={`h-full rounded-full ${strengthConfig[strength].color} ${strengthConfig[strength].width}`}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-xs text-secondary mt-1">
                      Strength:{" "}
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

              <div>
                <label className="block text-xs font-bold text-heading uppercase tracking-wide mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-heading bg-transparent border-none cursor-pointer"
                  >
                    {showConfirm ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {confirmPassword && (
                  <p
                    className={`text-xs mt-1 ${
                      newPassword === confirmPassword
                        ? "text-success"
                        : "text-red-500"
                    }`}
                  >
                    {newPassword === confirmPassword
                      ? "✓ Passwords match"
                      : "✗ Passwords do not match"}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword ||
                  strength === "weak"
                }
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  <>
                    Reset Password <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}