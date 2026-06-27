"use client";

import { motion } from "framer-motion";

// Single skeleton block
export function SkeletonBlock({
    className = "",
    }: {
    className?: string;
    }) {
    return (
        <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className={`bg-border rounded-xl ${className}`}
        />
    );
}

// Full page skeleton shown while app loads
export default function PageSkeleton() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">

            {/* Logo skeleton */}
            <div className="flex items-center gap-3 mb-8 justify-center">
                <SkeletonBlock className="w-9 h-9 rounded-[10px]" />
                <SkeletonBlock className="w-36 h-6" />
            </div>

            {/* Card skeleton */}
            <div className="card flex flex-col gap-5">
                <SkeletonBlock className="w-48 h-7" />
                <SkeletonBlock className="w-64 h-4" />

                <div className="flex flex-col gap-4 mt-2">
                    <div>
                    <SkeletonBlock className="w-32 h-3 mb-2" />
                    <SkeletonBlock className="w-full h-12" />
                    </div>
                    <div>
                    <SkeletonBlock className="w-24 h-3 mb-2" />
                    <SkeletonBlock className="w-full h-12" />
                    </div>
                    <SkeletonBlock className="w-full h-12 mt-2" />
                </div>

                <SkeletonBlock className="w-48 h-4 mx-auto" />
            </div>
        </div>
        </div>
    );
}