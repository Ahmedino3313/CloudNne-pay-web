"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { withdrawalApi, walletApi, bankApi, userApi } from "@/lib/api";
import { Bank } from "@/types";
import { ArrowDownToLine, CheckCircle, Loader, ArrowRight, Lock, AlertCircle, ShieldCheck, } from "lucide-react";

type PageState = "loading" | "set-pin" | "form" | "success";

export default function WithdrawPage() {
  const [pageState, setPageState] = useState<PageState>("loading");
  const [balance, setBalance] = useState(0);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);

  // Withdrawal form state
  const [amount, setAmount] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [selectedBankName, setSelectedBankName] = useState("");

  // Account verification state
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  // Set PIN state
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [settingPin, setSettingPin] = useState(false);

  // On mount — check security status, load wallet and banks
  useEffect(() => {
    const init = async () => {
      try {
        const [walletRes, banksRes, securityRes] = await Promise.all([
          walletApi.getWallet(),
          bankApi.getAll(),
          userApi.getSecurity(),
        ]);

        setBalance(walletRes.data.data!.balance);
        setBanks(banksRes.data.data!);

        // Check if user has a PIN
        if (securityRes.data.data!.hasPin) {
          setPageState("form");
        } else {
          setPageState("set-pin");
        }
      } catch {
        setPageState("form");
      } finally {
        setLoadingBanks(false);
      }
    };

    init();
  }, []);

  // Auto-verify account when bank and 10-digit number are filled
  useEffect(() => {
    if (!bankCode || accountNumber.length !== 10) {
      setAccountName("");
      return;
    }

    const verify = async () => {
      setVerifying(true);
      setVerifyError("");
      setAccountName("");

      try {
        const { data } = await bankApi.verifyAccount({
          accountNumber,
          bankCode,
        });
        setAccountName(data.data!.accountName);
      } catch {
        setVerifyError(
          "Could not verify this account. Please check the details."
        );
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [bankCode, accountNumber]);

  // Handle setting PIN
  const handleSetPin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPinError("");

    if (newPin.length !== 4) {
      setPinError("PIN must be exactly 4 digits.");
      return;
    }

    if (newPin !== confirmPin) {
      setPinError("PINs do not match. Please try again.");
      return;
    }

    setSettingPin(true);

    try {
      await userApi.setPin(newPin);
      // Automatically move to withdrawal form
      setPageState("form");
    } catch (err: any) {
      setPinError(
        err?.response?.data?.message ?? "Failed to set PIN. Please try again."
      );
    } finally {
      setSettingPin(false);
    }
  };

  // Handle withdrawal
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!accountName) return;

    setLoading(true);
    setError("");

    try {
      const { data } = await withdrawalApi.request({
        amount: Number(amount),
        bankName: selectedBankName,
        bankCode,
        accountNumber,
        accountName,
        transactionPin: pin,
      });
      setReference(data.data?.reference ?? "");
      setPageState("success");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Withdrawal failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPageState("form");
    setAmount("");
    setBankCode("");
    setAccountNumber("");
    setAccountName("");
    setPin("");
    setReference("");
    setError("");
    setSelectedBankName("");
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
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
            <ArrowDownToLine
              size={20}
              className="text-success"
              strokeWidth={1.8}
            />
          </div>
          <h1 className="text-2xl font-black text-heading">Withdraw</h1>
        </div>
        <p className="text-secondary text-sm">
          Move your wallet balance to your bank account
        </p>
      </motion.div>

      {/* Balance card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-4 mb-6 flex items-center justify-between"
      >
        <span className="text-secondary text-sm">Available Balance</span>
        <span className="text-xl font-black text-heading">
          &#8358;{balance.toLocaleString()}
        </span>
      </motion.div>

      <AnimatePresence mode="wait">

        {/* Loading */}
        {pageState === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="card flex items-center justify-center py-12"
          >
            <Loader size={24} className="animate-spin text-primary" />
          </motion.div>
        )}

        {/* Set PIN screen */}
        {pageState === "set-pin" && (
          <motion.div
            key="set-pin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card"
          >
            {/* Icon and heading */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck size={28} className="text-primary" />
              </div>
              <h2 className="text-xl font-black text-heading mb-2">
                Set Transaction PIN
              </h2>
              <p className="text-secondary text-sm max-w-xs">
                You need a 4-digit PIN to authorize withdrawals.
                This keeps your wallet safe.
              </p>
            </div>

            {pinError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5"
              >
                {pinError}
              </motion.div>
            )}

            <form onSubmit={handleSetPin} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold text-heading uppercase tracking-wide mb-2">
                  New PIN
                </label>
                <input
                  type="password"
                  value={newPin}
                  onChange={(e) =>
                    setNewPin(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  placeholder="Enter 4-digit PIN"
                  maxLength={4}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-heading uppercase tracking-wide mb-2">
                  Confirm PIN
                </label>
                <input
                  type="password"
                  value={confirmPin}
                  onChange={(e) =>
                    setConfirmPin(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  placeholder="Confirm your PIN"
                  maxLength={4}
                  required
                />
              </div>

              {/* PIN dots indicator */}
              <div className="flex items-center justify-center gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: newPin.length > i ? 1.2 : 1,
                      backgroundColor:
                        newPin.length > i ? "#E11D48" : "#E2E8F0",
                    }}
                    transition={{ duration: 0.2 }}
                    className="w-3 h-3 rounded-full"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={
                  settingPin ||
                  newPin.length !== 4 ||
                  confirmPin.length !== 4
                }
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {settingPin ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  <>
                    Set PIN & Continue <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {/* Withdrawal form */}
        {pageState === "form" && (
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

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-heading uppercase tracking-wide mb-2">
                  Amount (&#8358;)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Min ₦500"
                  min="500"
                  max={balance}
                  required
                />
                <button
                  type="button"
                  onClick={() => setAmount(String(balance))}
                  className="text-xs text-primary mt-1 bg-transparent border-none cursor-pointer hover:underline"
                >
                  Withdraw all (&#8358;{balance.toLocaleString()})
                </button>
              </div>

              {/* Bank */}
              <div>
                <label className="block text-xs font-bold text-heading uppercase tracking-wide mb-2">
                  Bank Name
                </label>
                {loadingBanks ? (
                  <div className="flex items-center gap-2 text-secondary text-sm py-3">
                    <Loader size={14} className="animate-spin" />
                    Loading banks...
                  </div>
                ) : (
                  <select
                    value={bankCode}
                    onChange={(e) => {
                      setBankCode(e.target.value);
                      const bank = banks.find(
                        (b) => b.code === e.target.value
                      );
                      setSelectedBankName(bank?.name ?? "");
                    }}
                    required
                  >
                    <option value="">Select your bank</option>
                    {banks.map((b, i) => (
                      <option key={`${b.code}-${i}`} value={b.code}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Account number */}
              <div>
                <label className="block text-xs font-bold text-heading uppercase tracking-wide mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) =>
                    setAccountNumber(
                      e.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                  placeholder="0123456789"
                  maxLength={10}
                  required
                />
              </div>

              {/* Account name — auto verified */}
              {(verifying || accountName || verifyError) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {verifying && (
                    <div className="flex items-center gap-2 text-secondary text-sm bg-card border border-border rounded-xl p-3">
                      <Loader size={14} className="animate-spin" />
                      Verifying account...
                    </div>
                  )}
                  {accountName && !verifying && (
                    <div className="flex items-center gap-2 text-success text-sm bg-green-50 border border-green-200 rounded-xl p-3">
                      <CheckCircle size={16} />
                      <span className="font-semibold">{accountName}</span>
                    </div>
                  )}
                  {verifyError && !verifying && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl p-3">
                      <AlertCircle size={16} />
                      {verifyError}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Transaction PIN */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-heading uppercase tracking-wide mb-2">
                  <Lock size={12} />
                  Transaction PIN
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) =>
                    setPin(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  placeholder="••••"
                  maxLength={4}
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  loading ||
                  !amount ||
                  !bankCode ||
                  !accountNumber ||
                  !accountName ||
                  pin.length !== 4 ||
                  Number(amount) > balance
                }
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {loading ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  <>
                    Withdraw <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {/* Success */}
        {pageState === "success" && (
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
              Withdrawal Initiated! 🏦
            </h2>
            <p className="text-secondary text-sm mb-1">
              ₦{Number(amount).toLocaleString()} is being sent to
            </p>
            <p className="text-heading font-bold mb-1">
              {accountName} — {selectedBankName}
            </p>
            <p className="text-secondary text-xs mb-6">
              Ref: {reference}
            </p>
            <button
              onClick={handleReset}
              className="btn-primary px-8 py-2.5"
            >
              Withdraw Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}