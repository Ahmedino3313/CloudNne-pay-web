"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader, CheckCircle, RefreshCw, Mail } from "lucide-react";
import AuthNavbar from "@/components/layout/AuthNavbar";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const email = searchParams.get("email");

  const { setUser } = useAuthStore();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Redirect if no userId
  useEffect(() => {
    if (!userId || !email) {
      router.push("/auth/register");
    }
  }, [userId, email, router]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // only take last character
    setOtp(newOtp);
    setError("");

    // Auto move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit when all 6 digits are filled
    if (newOtp.every((d) => d !== "") && value) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move back on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      handleVerify(pasted);
    }
  };

  const handleVerify = async (code: string) => {
    if (!userId || code.length !== 6) return;
    setLoading(true);
    setError("");

    try {
      const { data } = await authApi.verifyOtp({ userId, otp: code });
      const { user } = data.data!;
      // Cookies are set by the API automatically
      // Just update our local store
      setUser(user);
      setSuccess(true);

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Invalid code. Please try again."
      );
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!userId || !canResend) return;
    setResending(true);
    setError("");

    try {
      await authApi.resendOtp(userId);
      setCountdown(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Failed to resend code."
      );
    } finally {
      setResending(false);
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
              Email Verified!
            </h2>
            <p className="text-secondary text-sm">
              Redirecting to your dashboard...
            </p>
          </div>
        ) : (
          <div className="card">
            {/* Icon */}
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-5">
              <Mail size={22} className="text-primary" />
            </div>

            <h1 className="text-2xl font-black text-heading mb-1">
              Verify your account
            </h1>
            <p className="text-secondary text-sm mb-2">
              We sent a 6-digit code to your email and phone number
            </p>
            <p className="text-heading font-bold text-sm mb-8">
              {email}
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

            {/* OTP inputs */}
            <div
              className="flex items-center gap-3 justify-center mb-8"
              onPaste={handlePaste}
            >
              {otp.map((digit, i) => (
                <motion.input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`w-12 h-14 text-center text-xl font-black text-heading rounded-xl border-2 transition-all duration-200 ${
                    digit
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card"
                  } ${loading ? "opacity-50" : ""}`}
                  disabled={loading}
                  style={{ padding: 0 }}
                />
              ))}
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center gap-2 text-secondary text-sm mb-6">
                <Loader size={16} className="animate-spin text-primary" />
                Verifying...
              </div>
            )}

            {/* Resend */}
            <div className="text-center">
              <p className="text-secondary text-sm mb-2">
                Didn&apos;t receive the code?
              </p>
              {canResend ? (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="flex items-center gap-2 text-primary text-sm font-semibold bg-transparent border-none cursor-pointer hover:underline mx-auto"
                >
                  {resending ? (
                    <Loader size={14} className="animate-spin" />
                  ) : (
                    <RefreshCw size={14} />
                  )}
                  Resend Code
                </button>
              ) : (
                <p className="text-secondary text-sm">
                  Resend in{" "}
                  <span className="text-primary font-semibold">
                    {countdown}s
                  </span>
                </p>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}