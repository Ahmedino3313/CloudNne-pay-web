"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const links = ["Features", "How It Works", "Pricing"];

    return (
        <>
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-50 h-17.5 flex items-center justify-between px-8 transition-all duration-300 ${
                scrolled
                    ? "bg-background border-b border-border shadow-sm"
                    : "bg-transparent"
                }`}
            >
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-3 no-underline"
                >
                    <Image
                        src="/logo.jpeg"
                        alt="CloudNine Pay Logo"
                        width={36}
                        height={36}
                        className="rounded-[10px] object-contain"
                    />
                    <span className="text-lg font-bold text-heading">
                        CloudNine<span className="text-primary">Pay</span>
                    </span>
                </Link>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map((link, i) => (
                        <motion.a
                            key={link}
                            href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 + 0.2 }}
                            className="text-secondary text-sm font-medium no-underline hover:text-heading transition-colors duration-200"
                        >
                            {link}
                        </motion.a>
                    ))}

                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center gap-3"
                    >
                        <Link href="/auth/login" className="no-underline">
                            <button className="border border-border text-heading px-5 py-2 rounded-lg text-sm font-semibold hover:border-primary hover:text-primary transition-all duration-200 bg-transparent cursor-pointer">
                                Log In
                            </button>
                        </Link>

                        <Link href="/auth/register" className="no-underline">
                            <button className="btn-primary px-5 py-2 text-sm">
                                Get Started
                            </button>
                        </Link>
                    </motion.div>
                </div>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden bg-transparent border-none text-heading cursor-pointer p-2"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </motion.nav>

            {/* Overlay and drawer */}
            <AnimatePresence>
                {menuOpen && (
                <>
                    {/* Dark overlay */}
                    <motion.div
                    key="overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    />

                    {/* Drawer */}
                    <motion.div
                        key="drawer"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-70 bg-background z-50 md:hidden flex flex-col p-8 shadow-2xl"
                    >
                        {/* Drawer header */}
                        <div className="flex items-center justify-between mb-10">

                            <span className="text-lg font-bold text-heading">
                            CloudNine<span className="text-primary">Pay</span>
                            </span>

                            <button
                                onClick={() => setMenuOpen(false)}
                                className="bg-transparent border-none text-heading cursor-pointer p-2"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Drawer links */}
                        <div className="flex flex-col gap-6 flex-1">
                            {links.map((link, i) => (
                                <motion.a
                                    key={link}
                                    href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                                    onClick={() => setMenuOpen(false)}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.07 + 0.1 }}
                                    className="text-heading no-underline text-base font-medium hover:text-primary transition-colors duration-200"
                                >
                                    {link}
                                </motion.a>
                            ))}
                        </div>

                        {/* Drawer buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col gap-3 mt-auto"
                        >
                            <Link
                                href="/auth/login"
                                className="no-underline"
                                onClick={() => setMenuOpen(false)}
                            >
                                <button className="btn-secondary w-full">
                                    Log In
                                </button>
                            </Link>

                            <Link
                                href="/auth/register"
                                className="no-underline"
                                onClick={() => setMenuOpen(false)}
                            >
                                <button className="btn-primary w-full">
                                    Get Started
                                </button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </>
                )}
            </AnimatePresence>
        </>
    );
}