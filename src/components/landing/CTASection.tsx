"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Mail, X } from "lucide-react";
import { FaInstagram, FaTiktok } from "react-icons/fa";

export default function CTASection() {
    return (
        <>
        {/* CTA */}
        <section className="py-24 px-8 bg-background">
            <div className="max-w-3xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6 }}
                    className="bg-card border border-border rounded-3xl p-12 relative overflow-hidden"
                >
                    {/* Red glow */}
                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

                    <span className="inline-block bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-4 py-2 rounded-full mb-6 uppercase tracking-wide relative">
                        Ready to Start?
                    </span>

                    <h2 className="text-4xl md:text-5xl font-black text-heading tracking-tight mb-4 relative">
                        Your airtime has value.{" "}
                        <span className="gradient-text">Claim it.</span>
                    </h2>

                    <p className="text-secondary text-lg leading-relaxed mb-8 relative max-w-lg mx-auto">
                        Join 50,000+ Nigerians who already trust CloudNine Pay
                        to convert, manage and withdraw their money instantly.
                    </p>

                    <div className="flex items-center justify-center gap-4 flex-wrap relative">
                        <Link href="/auth/register" className="no-underline">
                            <button className="btn-primary flex items-center gap-2 px-8 py-3 text-base">
                            Create Free Account <ArrowRight size={18} />
                            </button>
                        </Link>

                        <Link href="/auth/login" className="no-underline">
                            <button className="btn-secondary flex items-center gap-2 px-8 py-3 text-base">
                                Log In
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border px-8 py-10">
            <div className="max-w-6xl mx-auto">

                {/* Top row */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">

                    {/* Logo */}
                    <div>
                        <span className="text-xl font-bold text-heading">
                            CloudNine<span className="text-primary">Pay</span>
                        </span>

                        <p className="text-secondary text-sm mt-1 max-w-xs">
                            Nigeria&apos;s fastest airtime-to-cash platform. Fast, secure and reliable.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-8">
                        <div className="flex flex-col gap-2">
                            <p className="text-heading font-semibold text-sm mb-1">Product</p>
                            <Link href="#features" className="text-secondary text-sm hover:text-primary transition-colors no-underline">Features</Link>
                            <Link href="#how-it-works" className="text-secondary text-sm hover:text-primary transition-colors no-underline">How It Works</Link>
                            <Link href="#pricing" className="text-secondary text-sm hover:text-primary transition-colors no-underline">Pricing</Link>
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="text-heading font-semibold text-sm mb-1">Company</p>
                            <Link href="/about" className="text-secondary text-sm hover:text-primary transition-colors no-underline">About</Link>
                            <Link href="/contact" className="text-secondary text-sm hover:text-primary transition-colors no-underline">Contact</Link>
                            <Link href="/blog" className="text-secondary text-sm hover:text-primary transition-colors no-underline">Blog</Link>
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="text-heading font-semibold text-sm mb-1">Legal</p>
                            <Link href="/privacy" className="text-secondary text-sm hover:text-primary transition-colors no-underline">Privacy Policy</Link>
                            <Link href="/terms" className="text-secondary text-sm hover:text-primary transition-colors no-underline">Terms of Service</Link>
                        </div>
                    </div>
                </div>

                {/* Bottom row */}
                <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* Copyright */}
                    <span className="text-secondary text-sm">
                        © {new Date().getFullYear()} CloudNine Pay · African-built, globally polished.
                    </span>

                    {/* Social links */}
                    <div className="flex items-center gap-5">
                        <a href="#" className="text-secondary hover:text-primary transition-colors duration-200">
                            <X size={18} />
                        </a>

                        <a href="#" className="text-secondary hover:text-primary transition-colors duration-200">
                            <FaInstagram size={18} />
                        </a>

                        <a href="#" className="text-secondary hover:text-primary transition-colors duration-200">
                            <FaTiktok size={18} />
                        </a>

                        <a href="#" className="text-secondary hover:text-primary transition-colors duration-200">
                            <Mail size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
        </>
    );
}