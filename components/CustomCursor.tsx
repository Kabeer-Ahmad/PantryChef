'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)
    const [isMobile, setIsMobile] = useState(true)

    useEffect(() => {
        // Check if device supports fine pointer (mouse/trackpad)
        const checkMobile = () => {
            const hasFinePointer = window.matchMedia('(pointer: fine)').matches
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
            setIsMobile(isTouchDevice && !hasFinePointer)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)

        if (isMobile) return

        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a')
            ) {
                setIsHovering(true)
            } else {
                setIsHovering(false)
            }
        }

        window.addEventListener('mousemove', updateMousePosition)
        window.addEventListener('mouseover', handleMouseOver)

        return () => {
            window.removeEventListener('resize', checkMobile)
            window.removeEventListener('mousemove', updateMousePosition)
            window.removeEventListener('mouseover', handleMouseOver)
        }
    }, [isMobile])

    // Don't render on mobile devices
    if (isMobile) return null

    return (
        <>
            <motion.div
                className="hidden md:block fixed top-0 left-0 w-4 h-4 bg-cyan-500 rounded-full pointer-events-none z-[9999] mix-blend-difference"
                animate={{
                    x: mousePosition.x - 8,
                    y: mousePosition.y - 8,
                    scale: isHovering ? 2.5 : 1,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 150,
                    damping: 15,
                    mass: 0.1,
                }}
            />
            <motion.div
                className="hidden md:block fixed top-0 left-0 w-8 h-8 border border-cyan-400 rounded-full pointer-events-none z-[9998]"
                animate={{
                    x: mousePosition.x - 16,
                    y: mousePosition.y - 16,
                    scale: isHovering ? 1.5 : 1,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 20,
                    mass: 0.2,
                }}
            />
        </>
    )
}
