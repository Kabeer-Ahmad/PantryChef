'use client'

import { motion } from 'framer-motion'

export default function AnimatedBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
            {/* Large Gradient Blobs - Main Animation - Spread out more */}
            <motion.div
                className="absolute -top-20 -left-20 sm:top-0 sm:left-0 w-80 h-80 sm:w-[500px] sm:h-[500px] bg-gradient-to-br from-cyan-400/12 to-blue-500/10 rounded-full blur-3xl"
                animate={{
                    x: [0, 150, -50, 0],
                    y: [0, 100, 80, 0],
                    scale: [1, 1.3, 1.1, 1],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute top-10 -right-20 sm:top-1/4 sm:right-0 w-72 h-72 sm:w-[450px] sm:h-[450px] bg-gradient-to-br from-blue-400/12 to-purple-500/10 rounded-full blur-3xl"
                animate={{
                    x: [0, -120, -80, 0],
                    y: [0, -100, -50, 0],
                    scale: [1, 1.4, 1.2, 1],
                    rotate: [360, 180, 0],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
            />
            <motion.div
                className="absolute -bottom-20 left-10 sm:bottom-0 sm:left-1/4 w-64 h-64 sm:w-[400px] sm:h-[400px] bg-gradient-to-br from-cyan-300/12 to-pink-400/10 rounded-full blur-3xl"
                animate={{
                    x: [0, 100, 120, 0],
                    y: [0, -120, -100, 0],
                    scale: [1, 1.2, 1.15, 1],
                    rotate: [0, -180, -360],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 4,
                }}
            />
            <motion.div
                className="absolute bottom-10 -right-10 sm:bottom-0 sm:right-1/3 w-80 h-80 sm:w-[500px] sm:h-[500px] bg-gradient-to-br from-blue-300/12 to-cyan-400/10 rounded-full blur-3xl"
                animate={{
                    x: [0, -150, -100, 0],
                    y: [0, 120, 100, 0],
                    scale: [1, 1.35, 1.2, 1],
                    rotate: [360, 0, 360],
                }}
                transition={{
                    duration: 28,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
            />
            <motion.div
                className="absolute top-1/2 -left-10 sm:top-1/2 sm:left-0 w-56 h-56 sm:w-[350px] sm:h-[350px] bg-gradient-to-br from-purple-300/12 to-cyan-400/10 rounded-full blur-3xl"
                animate={{
                    x: [0, 180, 150, 0],
                    y: [0, -80, -60, 0],
                    scale: [1, 1.25, 1.1, 1],
                    rotate: [0, 90, 180],
                }}
                transition={{
                    duration: 26,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 3,
                }}
            />
            <motion.div
                className="absolute -top-10 right-10 sm:top-0 sm:right-0 w-72 h-72 sm:w-[450px] sm:h-[450px] bg-gradient-to-br from-pink-300/12 to-blue-400/10 rounded-full blur-3xl"
                animate={{
                    x: [0, -130, -110, 0],
                    y: [0, 150, 120, 0],
                    scale: [1, 1.3, 1.15, 1],
                    rotate: [180, 0, 180],
                }}
                transition={{
                    duration: 24,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5,
                }}
            />

            {/* Smaller accent blobs - More spread out */}
            <motion.div
                className="absolute top-1/3 left-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-cyan-200/10 to-blue-300/8 rounded-full blur-2xl"
                animate={{
                    x: [0, 80, 60, 0],
                    y: [0, 50, 40, 0],
                    scale: [1, 1.2, 1.1, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5,
                }}
            />
            <motion.div
                className="absolute bottom-1/4 right-1/3 w-40 h-40 sm:w-56 sm:h-56 bg-gradient-to-br from-purple-200/10 to-pink-300/8 rounded-full blur-2xl"
                animate={{
                    x: [0, -70, -50, 0],
                    y: [0, 80, 60, 0],
                    scale: [1, 1.25, 1.1, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 3.5,
                }}
            />
            <motion.div
                className="absolute top-3/4 left-1/4 w-44 h-44 sm:w-60 sm:h-60 bg-gradient-to-br from-blue-200/10 to-cyan-300/8 rounded-full blur-2xl"
                animate={{
                    x: [0, 90, 70, 0],
                    y: [0, -60, -50, 0],
                    scale: [1, 1.15, 1.05, 1],
                }}
                transition={{
                    duration: 16,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 6,
                }}
            />

            {/* Mesh gradient overlay for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-100/10 via-transparent to-blue-100/10" />
        </div>
    )
}

