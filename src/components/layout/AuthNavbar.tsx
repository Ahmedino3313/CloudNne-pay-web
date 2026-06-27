"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function AuthNavbar() {
    return (
        <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 h-17.5 flex items-center justify-between px-8 bg-background border-b border-border"
        >
            {/* Logo */}
            <Link href="/" className="no-underline flex items-center gap-3">
                <Image
                src="/logo.jpeg"
                alt="CloudNine Pay"
                width={36}
                height={36}
                className="rounded-[10px] object-contain"
                />
                
                <span className="text-lg font-bold text-heading">
                CloudNine<span className="text-primary">Pay</span>
                </span>
            </Link>

            {/* Back to Home */}
            <Link
                href="/"
                className="no-underline flex items-center gap-2 text-secondary hover:text-primary transition-colors duration-200 text-sm font-medium"
            >
                <ArrowLeft size={16} />
                Back to Home
            </Link>
        </motion.nav>
    );
}