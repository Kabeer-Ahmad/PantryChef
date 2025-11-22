'use client'

import { useEffect, useState, useRef } from 'react'

export default function CustomCursor() {
    const [isMobile, setIsMobile] = useState(true)
    const innerRef = useRef<HTMLDivElement>(null)
    const outerRef = useRef<HTMLDivElement>(null)
    const rafRef = useRef<number | null>(null)

    // Cursor positions
    const mouseRef = useRef({ x: 0, y: 0 })
    const cursorRef = useRef({ x: 0, y: 0 })
    const outerCursorRef = useRef({ x: 0, y: 0 })

    const hoveringRef = useRef(false)
    const isSafariRef = useRef(false)

    useEffect(() => {
        // Detect Safari
        isSafariRef.current = typeof window !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

        const checkMobile = () => {
            const hasFinePointer = window.matchMedia('(pointer: fine)').matches
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
            const mobile = isTouchDevice && !hasFinePointer
            setIsMobile(mobile)
            return mobile
        }

        const isMobileDevice = checkMobile()
        window.addEventListener('resize', checkMobile, { passive: true })

        if (isMobileDevice) {
            return () => {
                window.removeEventListener('resize', checkMobile)
            }
        }

        let animationFrameId: number | null = null

        // Animation loop
        const animate = () => {
            if (!innerRef.current || !outerRef.current) {
                animationFrameId = requestAnimationFrame(animate)
                return
            }

            // Inner cursor follows mouse instantly (or very fast lerp)
            const { x: mouseX, y: mouseY } = mouseRef.current

            // Outer cursor follows with smooth lerp
            // Adjust lerp speed: lower = smoother/slower, higher = faster/responsive
            const lerpSpeed = isSafariRef.current ? 0.25 : 0.15

            outerCursorRef.current.x += (mouseX - outerCursorRef.current.x) * lerpSpeed
            outerCursorRef.current.y += (mouseY - outerCursorRef.current.y) * lerpSpeed

            const innerX = mouseX
            const innerY = mouseY
            const outerX = outerCursorRef.current.x
            const outerY = outerCursorRef.current.y

            const innerScale = hoveringRef.current ? 2.5 : 1
            const outerScale = hoveringRef.current ? 1.5 : 1

            // Apply transforms directly
            innerRef.current.style.transform = `translate3d(${innerX - 8}px, ${innerY - 8}px, 0) scale(${innerScale})`
            outerRef.current.style.transform = `translate3d(${outerX - 16}px, ${outerY - 16}px, 0) scale(${outerScale})`

            // Handle hover styles
            if (hoveringRef.current) {
                innerRef.current.style.backgroundColor = 'rgba(6, 182, 212, 0.2)'
                innerRef.current.style.border = '2px solid rgba(6, 182, 212, 0.6)'
            } else {
                innerRef.current.style.backgroundColor = 'rgb(6, 182, 212)'
                innerRef.current.style.border = 'none'
            }

            animationFrameId = requestAnimationFrame(animate)
        }

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY }

            // Initialize positions on first move to prevent jumping
            if (cursorRef.current.x === 0 && cursorRef.current.y === 0) {
                cursorRef.current = { x: e.clientX, y: e.clientY }
                outerCursorRef.current = { x: e.clientX, y: e.clientY }
            }
        }

        // Throttle hover detection for Safari to prevent stuttering
        let lastHoverCheck = 0
        const hoverThrottle = isSafariRef.current ? 50 : 0

        const handleMouseOver = (e: MouseEvent) => {
            // Throttle on Safari
            if (isSafariRef.current) {
                const now = performance.now()
                if (now - lastHoverCheck < hoverThrottle) return
                lastHoverCheck = now
            }

            const target = e.target as HTMLElement
            // Simplified check - avoid expensive getComputedStyle on Safari
            const isHoverable = target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList.contains('cursor-pointer') ||
                (!isSafariRef.current && window.getComputedStyle(target).cursor === 'pointer')

            hoveringRef.current = !!isHoverable
        }

        window.addEventListener('mousemove', handleMouseMove, { passive: true })
        window.addEventListener('mouseover', handleMouseOver, { passive: true })

        // Start animation loop after a small delay to ensure refs are set
        const startTimeout = setTimeout(() => {
            animationFrameId = requestAnimationFrame(animate)
        }, 10)

        return () => {
            clearTimeout(startTimeout)
            window.removeEventListener('resize', checkMobile)
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseover', handleMouseOver)
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId)
            }
        }
    }, [])

    if (isMobile) return null

    return (
        <>
            <div
                ref={innerRef}
                className="hidden md:block fixed top-0 left-0 w-4 h-4 bg-cyan-500 rounded-full pointer-events-none z-[9999]"
                style={{
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    // Only transition colors, NOT transform
                    transition: 'background-color 0.2s ease, border 0.2s ease'
                }}
            />
            <div
                ref={outerRef}
                className="hidden md:block fixed top-0 left-0 w-8 h-8 border border-cyan-400 rounded-full pointer-events-none z-[9998]"
                style={{
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    // No transition for transform to avoid fighting JS lerp
                    transition: 'none'
                }}
            />
        </>
    )
}
