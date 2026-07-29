"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import PageSkeleton from "@/components/ui/SkeletonLoader";
import Sidebar from "@/components/dashboard/Sidebar";

export default function AdminLayout({
    children,
    }: {
    children: React.ReactNode;
    }) {
    const router = useRouter();
    const { isAuthenticated, isLoading, loadUser, user } = useAuthStore();

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
        router.push("/auth/login");
        return;
        }
        if (
        !isLoading &&
        isAuthenticated &&
        user?.role !== "ADMIN" &&
        user?.role !== "SUPER_ADMIN"
        ) {
        router.push("/dashboard");
        }
    }, [isAuthenticated, isLoading, user, router]);

    if (isLoading) return <PageSkeleton />;
    if (!isAuthenticated) return null;
    if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") return null;

    return (
        <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 md:p-8 p-4 pt-19 md:pt-8 overflow-y-auto">
            {children}
        </main>
        </div>
    );
}