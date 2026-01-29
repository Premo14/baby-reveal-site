"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { addGuess, subscribeToGuesses, Guess } from "@/services/guessingService";
import FloatingContainer from "./FloatingContainer";

export default function GuessingGame() {
    const [name, setName] = useState("");
    const [guess, setGuess] = useState<"boy" | "girl" | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [counts, setCounts] = useState({ boy: 0, girl: 0 });

    useEffect(() => {
        const unsubscribe = subscribeToGuesses((guesses: Guess[]) => {
            const newCounts = guesses.reduce((acc, curr) => {
                acc[curr.gender]++;
                return acc;
            }, { boy: 0, girl: 0 });
            setCounts(newCounts);
        });

        return () => unsubscribe();
    }, []);

    const handleGuess = (selectedGuess: "boy" | "girl") => {
        setGuess(selectedGuess);

        // Trigger confetti based on selection
        // Muted colors for traditional vibe
        const color = selectedGuess === "boy" ? "#a8c0ce" : "#eec4c4";
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: [color, "#f5f0e6", "#8b7355"],
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !guess) return;

        // Trigger backend save
        try {
            await addGuess(name, guess);
            setSubmitted(true);

            // Optimistic update for instant gratification
            setCounts(prev => ({
                ...prev,
                [guess]: prev[guess] + 1
            }));

            // Victory confetti
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 },
                colors: ["#8b7355", "#f5f0e6", guess === "boy" ? "#a8c0ce" : "#eec4c4"]
            });
        } catch (error) {
            console.error("Failed to submit guess", error);
        }
    };

    return (
        <section className="min-h-screen py-20 px-4 flex flex-col items-center relative z-10 bg-[#F5F0E6]">
            <FloatingContainer delay={0.3}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-md w-full text-center bg-white/90 backdrop-blur-sm p-8 rounded shadow-xl border-4 border-[#D4C4A8] transform rotate-1"
                >
                    <h2 className="text-3xl font-bold text-[#4A4036] mb-6 font-serif drop-shadow-sm">
                        Cast Your Vote!
                    </h2>

                    {/* Live Stats Bar */}
                    <div className="flex w-full h-4 bg-[#D4C4A8]/30 rounded-full overflow-hidden mb-4 shadow-inner border border-[#8B7355]/10">
                        <motion.div
                            initial={{ width: "50%" }}
                            animate={{ width: `${(counts.boy / (counts.boy + counts.girl || 1)) * 100}%` }}
                            className="h-full bg-[#a8c0ce] transition-all duration-1000"
                        />
                        <motion.div
                            initial={{ width: "50%" }}
                            animate={{ width: `${(counts.girl / (counts.boy + counts.girl || 1)) * 100}%` }}
                            className="h-full bg-[#eec4c4] transition-all duration-1000"
                        />
                    </div>

                    <div className="flex justify-between text-sm text-[#8B7355] mb-8 px-2 font-medium font-serif italic">
                        <span className="font-bold">{counts.boy} Votes for Boy</span>
                        <span className="font-bold">{counts.girl} Votes for Girl</span>
                    </div>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Name Input */}
                            <div className="text-left group">
                                <label htmlFor="name" className="block text-sm font-medium text-[#8B7355] mb-2 pl-1 transition-colors font-serif">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Auntie Sarah"
                                    className="w-full px-4 py-3 rounded bg-white border border-[#D4C4A8] text-[#4A4036] placeholder-[#D4C4A8] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] outline-none transition-all shadow-inner font-serif"
                                    required
                                />
                            </div>

                            {/* Gender Selection */}
                            <div className="flex gap-4 justify-center">
                                <button
                                    type="button"
                                    onClick={() => handleGuess("boy")}
                                    className={`flex-1 py-4 rounded border-2 transition-all transform hover:scale-105 active:scale-95 font-serif text-lg ${guess === "boy"
                                        ? "border-[#a8c0ce] bg-[#a8c0ce]/20 text-[#6b8a9e] font-bold shadow-md"
                                        : "border-[#D4C4A8] hover:border-[#a8c0ce]/50 text-[#8B7355]/60 hover:text-[#6b8a9e] hover:bg-[#a8c0ce]/10"
                                        }`}
                                >
                                    💙 Boy
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleGuess("girl")}
                                    className={`flex-1 py-4 rounded border-2 transition-all transform hover:scale-105 active:scale-95 font-serif text-lg ${guess === "girl"
                                        ? "border-[#eec4c4] bg-[#eec4c4]/20 text-[#a87f7f] font-bold shadow-md"
                                        : "border-[#D4C4A8] hover:border-[#eec4c4]/50 text-[#8B7355]/60 hover:text-[#a87f7f] hover:bg-[#eec4c4]/10"
                                        }`}
                                >
                                    💗 Girl
                                </button>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={!name || !guess}
                                className="w-full py-4 bg-[#8B7355] text-[#F5F0E6] font-bold rounded shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform transition-all hover:translate-y-[-2px] hover:shadow-xl font-serif tracking-wider"
                            >
                                Lock in Vote!
                            </button>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="p-8 bg-[#F5F0E6] rounded border border-[#D4C4A8] shadow-inner"
                        >
                            <div className="text-4xl mb-4">🎉</div>
                            <h3 className="text-2xl font-bold text-[#4A4036] mb-2 font-serif">Thanks, {name}!</h3>
                            <p className="text-[#8B7355] font-serif">
                                You guessed <strong>{guess === "boy" ? "Boy" : "Girl"}</strong>.
                                <br />
                                We'll see if you're right soon!
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </FloatingContainer>
        </section>
    );
}
