"use client";

import { motion } from "framer-motion";
import FloatingContainer from "./FloatingContainer";
import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#F5F0E6]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/traditional_hero_bg.png"
                    alt="Baby Announcement Background"
                    fill
                    className="object-cover opacity-90"
                    priority
                />
                {/* Soft overlay to ensure text contrast if needed, though the image has a clear center */}
                <div className="absolute inset-0 bg-white/10" />
            </div>

            {/* Content */}
            <div className="z-10 text-center flex flex-col items-center max-w-lg mx-auto px-4 mt-8 md:mt-0">
                <FloatingContainer delay={0}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-white/90 backdrop-blur-sm p-8 rounded shadow-xl border-4 border-[#D4C4A8] transform rotate-1"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-xl md:text-2xl text-[#8B7355] mb-4 font-serif italic tracking-wide">
                                The Premo Family Surprise
                            </h2>
                        </motion.div>

                        <motion.div
                            className="flex flex-col items-center justify-center space-y-2 border-t-2 border-b-2 border-[#8B7355]/20 py-6 my-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-serif text-[#4A4036] uppercase tracking-widest">
                                We Are
                            </h1>
                            <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#4A4036] uppercase tracking-widest mt-2">
                                Expecting
                            </h1>
                        </motion.div>

                        <motion.p
                            className="text-2xl md:text-3xl text-[#8B7355] font-serif mt-6 tracking-widest"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            JULY 2026
                        </motion.p>
                    </motion.div>
                </FloatingContainer>

                <FloatingContainer delay={0.6}>
                    <motion.button
                        onClick={() => document.getElementById('guess-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="mt-12 px-8 py-3 bg-[#8B7355] text-[#F5F0E6] rounded shadow-[2px_4px_6px_rgba(0,0,0,0.3),inset_0_-2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.2)] font-serif text-lg tracking-wider hover:bg-[#6F5B43] hover:translate-y-[1px] hover:shadow-[1px_2px_4px_rgba(0,0,0,0.3)] transition-all transform active:scale-95 flex items-center gap-2 border border-[#6F5B43]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                    >
                        <span>Guess the Gender</span>
                        <span className="text-xl">👇</span>
                    </motion.button>
                </FloatingContainer>
            </div>

            {/* Torn Paper Divider */}
            <div className="absolute bottom-0 w-full rotate-180 z-20 translate-y-1">
                <svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="w-full h-16 md:h-24 fill-[#F5F0E6] drop-shadow-[0_-5px_10px_rgba(0,0,0,0.1)]"
                >
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
            </div>
        </section>
    );
}
