"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { adminApi } from "@/lib/api";
import { User } from "@/types";
import { Users, Search, CheckCircle, XCircle, Loader, ShieldCheck, } from "lucide-react";
import { SkeletonBlock } from "@/components/ui/SkeletonLoader";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.getUsers({
        page,
        search: search || undefined,
      });
      setUsers(data.data! as User[]);
      setTotalPages(data.meta?.totalPages ?? 1);
      setTotal(data.meta?.total ?? 0);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleSearch = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleToggleStatus = async (id: string) => {
    setTogglingId(id);
    try {
      const { data } = await adminApi.toggleUser(id);
      setUsers((prev: User[]) =>
        prev.map((u) =>
          u.id === id ? { ...u, isActive: data.data!.isActive } : u
        )
      );
    } catch {
      // ignore
    } finally {
      setTogglingId(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return (
          <span className="badge-failed flex items-center gap-1">
            <ShieldCheck size={11} /> Super Admin
          </span>
        );
      case "ADMIN":
        return (
          <span className="badge-pending flex items-center gap-1">
            <ShieldCheck size={11} /> Admin
          </span>
        );
      default:
        return (
          <span className="badge-success flex items-center gap-1">
            Customer
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Users size={20} className="text-blue-500" strokeWidth={1.8} />
          </div>
          <h1 className="text-2xl font-black text-heading">
            User Management
          </h1>
        </div>
        <p className="text-secondary text-sm">
          {total} user{total !== 1 ? "s" : ""} registered
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="text-center"
            />
          </div>
          <button type="submit" className="btn-primary px-6 py-2.5">
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSearchInput("");
                setPage(1);
              }}
              className="btn-secondary px-4 py-2.5 text-sm"
            >
              Clear
            </button>
          )}
        </form>
      </motion.div>

      {/* Users table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-0 overflow-hidden"
      >
        {loading ? (
          <div className="flex flex-col gap-4 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <SkeletonBlock className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <SkeletonBlock className="w-40 h-4 mb-2" />
                  <SkeletonBlock className="w-56 h-3" />
                </div>
                <SkeletonBlock className="w-20 h-6 rounded-full" />
                <SkeletonBlock className="w-24 h-8 rounded-lg" />
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={32} className="text-secondary mx-auto mb-3" />
            <p className="text-heading font-semibold mb-1">No users found</p>
            <p className="text-secondary text-sm">
              Try a different search term
            </p>
          </div>
        ) : (
          users.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-4 p-4 ${
                i < users.length - 1 ? "border-b border-border" : ""
              }`}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                {u.fullName?.charAt(0) ?? "U"}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-heading truncate">
                    {u.fullName}
                  </p>
                  {getRoleBadge(u.role)}
                </div>
                <p className="text-xs text-secondary truncate">
                  {u.email} · {u.phone}
                </p>
                <p className="text-xs text-secondary mt-0.5">
                  Balance: ₦{(u as any).walletBalance?.toLocaleString() ?? 0}
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 shrink-0">
                {(u as any).isActive ? (
                  <span className="badge-success flex items-center gap-1">
                    <CheckCircle size={11} /> Active
                  </span>
                ) : (
                  <span className="badge-failed flex items-center gap-1">
                    <XCircle size={11} /> Inactive
                  </span>
                )}
              </div>

              {/* Toggle button */}
              {u.role !== "SUPER_ADMIN" && (
                <button
                  onClick={() => handleToggleStatus(u.id)}
                  disabled={togglingId === u.id}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer border ${
                    (u as any).isActive
                      ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                      : "bg-green-50 border-green-200 text-success hover:bg-green-100"
                  }`}
                >
                  {togglingId === u.id ? (
                    <Loader size={12} className="animate-spin" />
                  ) : (u as any).isActive ? (
                    <>
                      <XCircle size={12} /> Deactivate
                    </>
                  ) : (
                    <>
                      <CheckCircle size={12} /> Activate
                    </>
                  )}
                </button>
              )}
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary px-4 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-secondary">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary px-4 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}