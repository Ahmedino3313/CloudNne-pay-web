"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { userApi, walletApi } from "@/lib/api";
import { User, Lock, Bell, Wallet, CheckCircle, Loader, Eye, EyeOff, ShieldCheck, } from "lucide-react";

export default function SettingsPage() {
    const { user, loadUser } = useAuthStore();

    // Profile state
    const [fullName, setFullName] = useState(user?.fullName ?? "");
    const [phone, setPhone] = useState(user?.phone ?? "");
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState(false);
    const [profileError, setProfileError] = useState("");

    // Password state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState("");

  // Virtual account state
    const [virtualAccount, setVirtualAccount] = useState<{
        accountNumber: string | null;
        bankName: string | null;
    } | null>(null);
    const [loadingVA, setLoadingVA] = useState(false);
    const [gettingVA, setGettingVA] = useState(false);

    useEffect(() => {
        const fetchWallet = async () => {
        setLoadingVA(true);
        try {
            const { data } = await walletApi.getWallet();
            setVirtualAccount(data.data!.virtualAccount);
        } catch {
            // ignore
        } finally {
            setLoadingVA(false);
        }
        };
        fetchWallet();
    }, []);

    const handleSaveProfile = async (
        e: React.SyntheticEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setSavingProfile(true);
        setProfileError("");
        setProfileSuccess(false);

        try {
        await userApi.updateProfile({ fullName, phone });
        await loadUser();
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
        } catch (err: any) {
        setProfileError(
            err?.response?.data?.message ?? "Failed to update profile."
        );
        } finally {
        setSavingProfile(false);
        }
    };

    const handleChangePassword = async (
        e: React.SyntheticEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setSavingPassword(true);
        setPasswordError("");
        setPasswordSuccess(false);

        try {
            await userApi.changePassword({ currentPassword, newPassword });
            setPasswordSuccess(true);
            setCurrentPassword("");
            setNewPassword("");
            setTimeout(() => setPasswordSuccess(false), 3000);
        } catch (err: any) {
        setPasswordError(
            err?.response?.data?.message ?? "Failed to change password."
        );
        } finally {
        setSavingPassword(false);
        }
    };

    const handleGetVirtualAccount = async () => {
        setGettingVA(true);
        try {
        const { data } = await walletApi.getVirtualAccount();
        setVirtualAccount(data.data!.virtualAccount);
        } catch {
        // ignore
        } finally {
        setGettingVA(false);
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
            <h1 className="text-2xl font-black text-heading mb-1">Settings</h1>
                <p className="text-secondary text-sm">
                    Manage your account preferences
                </p>
        </motion.div>

        <div className="flex flex-col gap-6">

            {/* Profile */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
            >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                    <User size={18} className="text-blue-500" />
                </div>
                <div>
                    <h2 className="text-base font-bold text-heading">
                        Profile Information
                    </h2>
                    <p className="text-xs text-secondary">
                        Update your name and phone number
                    </p>
                </div>
            </div>

            {profileError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
                {profileError}
                </div>
            )}

            {profileSuccess && (
                <div className="bg-green-50 border border-green-200 text-success text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
                <CheckCircle size={15} />
                Profile updated successfully!
                </div>
            )}

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                <div>
                <label className="block text-xs font-bold text-heading uppercase tracking-wide mb-2">
                    Full Name
                </label>
                <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ahmed Tajudeen"
                    required
                />
                </div>
                <div>
                <label className="block text-xs font-bold text-heading uppercase tracking-wide mb-2">
                    Email Address
                </label>
                <input
                    type="email"
                    value={user?.email ?? ""}
                    disabled
                    className="opacity-60 cursor-not-allowed"
                />
                <p className="text-xs text-secondary mt-1">
                    Email cannot be changed
                </p>
                </div>
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
                </div>
                <button
                    type="submit"
                    disabled={savingProfile}
                    className="btn-primary flex items-center justify-center gap-2 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed w-fit px-6"
                >
                    {savingProfile ? (
                        <Loader size={16} className="animate-spin" />
                    ) : (
                        "Save Changes"
                    )}
                </button>
            </form>
            </motion.div>

            {/* Password */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
            >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                    <Lock size={18} className="text-primary" />
                </div>
                <div>
                <h2 className="text-base font-bold text-heading">
                    Change Password
                </h2>
                <p className="text-xs text-secondary">
                    Keep your account secure with a strong password
                </p>
                </div>
            </div>

            {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
                {passwordError}
                </div>
            )}

            {passwordSuccess && (
                <div className="bg-green-50 border border-green-200 text-success text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
                <CheckCircle size={15} />
                Password changed successfully!
                </div>
            )}

            <form
                onSubmit={handleChangePassword}
                className="flex flex-col gap-4"
            >
                <div>
                <label className="block text-xs font-bold text-heading uppercase tracking-wide mb-2">
                    Current Password
                </label>
                <div className="relative">
                    <input
                    type={showCurrentPass ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pr-12"
                    />
                    <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-heading bg-transparent border-none cursor-pointer"
                    >
                        {showCurrentPass ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-heading uppercase tracking-wide mb-2">
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            type={showNewPass ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min. 8 characters"
                            minLength={8}
                            required
                            className="pr-12"
                        />
                        <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-heading bg-transparent border-none cursor-pointer"
                        >
                            {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>
                <button
                type="submit"
                disabled={savingPassword}
                className="btn-primary flex items-center justify-center gap-2 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed w-fit px-6"
                >
                {savingPassword ? (
                    <Loader size={16} className="animate-spin" />
                ) : (
                    "Change Password"
                )}
                </button>
            </form>
            </motion.div>

            {/* Virtual Account */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
            >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                <Wallet size={18} className="text-success" />
                </div>
                <div>
                <h2 className="text-base font-bold text-heading">
                    Virtual Account
                </h2>
                <p className="text-xs text-secondary">
                    Fund your wallet via bank transfer
                </p>
                </div>
            </div>

            {loadingVA ? (
                <div className="flex items-center gap-2 text-secondary text-sm">
                <Loader size={14} className="animate-spin" />
                Loading...
                </div>
            ) : virtualAccount?.accountNumber ? (
                <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-secondary mb-1">
                    Your dedicated account number
                </p>
                <p className="text-2xl font-black text-heading tracking-wider mb-1">
                    {virtualAccount.accountNumber}
                </p>
                <p className="text-sm text-secondary">
                    {virtualAccount.bankName}
                </p>
                <p className="text-xs text-secondary mt-3">
                    Transfer any amount to this account to fund your wallet
                    instantly.
                </p>
                </div>
            ) : (
                <div>
                <p className="text-sm text-secondary mb-4">
                    You don&apos;t have a virtual account yet. Create one to fund
                    your wallet via bank transfer.
                </p>
                <button
                    onClick={handleGetVirtualAccount}
                    disabled={gettingVA}
                    className="btn-primary flex items-center justify-center gap-2 py-2.5 px-6 disabled:opacity-50"
                >
                    {gettingVA ? (
                    <Loader size={16} className="animate-spin" />
                    ) : (
                    <>
                        <Wallet size={16} />
                        Create Virtual Account
                    </>
                    )}
                </button>
                </div>
            )}
            </motion.div>

            {/* Security */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
            >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
                <ShieldCheck size={18} className="text-purple-500" />
                </div>
                <div>
                <h2 className="text-base font-bold text-heading">Security</h2>
                <p className="text-xs text-secondary">
                    Manage your security settings
                </p>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
                <div>
                    <p className="text-sm font-semibold text-heading">
                    Transaction PIN
                    </p>
                    <p className="text-xs text-secondary">
                    Required for withdrawals
                    </p>
                </div>
                <span className="badge-success">Active</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
                <div>
                    <p className="text-sm font-semibold text-heading">
                    Two-Factor Authentication
                    </p>
                    <p className="text-xs text-secondary">
                    Extra layer of security
                    </p>
                </div>
                <span className="badge-pending">Coming Soon</span>
                </div>
            </div>
            </motion.div>

            {/* Notifications preferences */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
            >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-yellow-50 rounded-xl flex items-center justify-center">
                <Bell size={18} className="text-yellow-500" />
                </div>
                <div>
                <h2 className="text-base font-bold text-heading">
                    Notifications
                </h2>
                <p className="text-xs text-secondary">
                    Choose what you get notified about
                </p>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {[
                {
                    label: "Transaction Alerts",
                    desc: "Get notified for every transaction",
                    enabled: true,
                },
                {
                    label: "Conversion Updates",
                    desc: "Status updates for airtime conversions",
                    enabled: true,
                },
                {
                    label: "Withdrawal Status",
                    desc: "Updates when withdrawals are processed",
                    enabled: true,
                },
                ].map((item) => (
                <div
                    key={item.label}
                    className="flex items-center justify-between p-3 bg-card border border-border rounded-xl"
                >
                    <div>
                    <p className="text-sm font-semibold text-heading">
                        {item.label}
                    </p>
                    <p className="text-xs text-secondary">{item.desc}</p>
                    </div>
                    <div
                    className={`w-10 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${
                        item.enabled ? "bg-primary" : "bg-border"
                    }`}
                    >
                    <div
                        className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        item.enabled ? "translate-x-4" : "translate-x-0"
                        }`}
                    />
                    </div>
                </div>
                ))}
            </div>
            </motion.div>
        </div>
        </div>
  );
}