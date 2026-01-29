"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FloatingContainerProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

export default function FloatingContainer({ children, delay = 0, className = "" }: FloatingContainerProps) {
    return (
        <motion.div
            className={className}
            animate={{
                y: [0, -15, 0],
            }}
            transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
                delay: delay,
            }}
        >
            {children}
        </motion.div>
    );
}
