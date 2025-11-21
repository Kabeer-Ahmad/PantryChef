'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChefHat, History, User, LogOut, Menu, X, Home } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

export default function Navbar({ user, onLoginClick }: { user: any; onLoginClick?: () => void }) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()
    const [isOpen, setIsOpen] = useState(false)

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
        setIsOpen(false)
    }

    // Hide on login page
    if (pathname === '/login') return null

    // Hide on landing page IF this is the layout navbar (missing onLoginClick)
    // The landing page renders its own Navbar with the onLoginClick prop
    if (pathname === '/' && !onLoginClick) return null

    const toggleMenu = () => setIsOpen(!isOpen)

    return (<>
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2 text-cyan-600 font-bold text-xl">
                            <ChefHat size={28} />
                            <span>PantryChef</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        {user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className={`text-sm font-medium hover:text-cyan-600 ${pathname === '/dashboard' ? 'text-cyan-600' : 'text-gray-500'}`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/history"
                                    className={`flex items-center gap-1 text-sm font-medium hover:text-cyan-600 ${pathname === '/history' ? 'text-cyan-600' : 'text-gray-500'}`}
                                >
                                    <History size={18} />
                                    History
                                </Link>
                                <Link
                                    href="/profile"
                                    className={`flex items-center gap-1 text-sm font-medium hover:text-cyan-600 ${pathname === '/profile' ? 'text-cyan-600' : 'text-gray-500'}`}
                                >
                                    <User size={18} />
                                    Profile
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-red-600"
                                >
                                    <LogOut size={18} />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            onLoginClick && pathname === '/' ? (
                                <button
                                    onClick={onLoginClick}
                                    className="rounded-md bg-cyan-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                                >
                                    Log in
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    className="rounded-md bg-cyan-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                                >
                                    Log in
                                </Link>
                            )
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-500 hover:text-gray-700 p-2"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-4 space-y-1 shadow-lg">
                            {user ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setIsOpen(false)}
                                        className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/dashboard' ? 'bg-cyan-50 text-cyan-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/history"
                                        onClick={() => setIsOpen(false)}
                                        className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/history' ? 'bg-cyan-50 text-cyan-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <History size={18} />
                                            History
                                        </div>
                                    </Link>
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/profile' ? 'bg-cyan-50 text-cyan-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <User size={18} />
                                            Profile
                                        </div>
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                                    >
                                        <div className="flex items-center gap-2">
                                            <LogOut size={18} />
                                            Sign Out
                                        </div>
                                    </button>
                                </>
                            ) : (
                                <div className="px-3 py-2">
                                    {onLoginClick && pathname === '/' ? (
                                        <button
                                            onClick={() => {
                                                onLoginClick()
                                                setIsOpen(false)
                                            }}
                                            className="w-full text-center rounded-md bg-cyan-600 px-3.5 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-cyan-500"
                                        >
                                            Log in
                                        </button>
                                    ) : (
                                        <Link
                                            href="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="block w-full text-center rounded-md bg-cyan-600 px-3.5 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-cyan-500"
                                        >
                                            Log in
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
        {/* Mobile Bottom Navigation - Only show when user is logged in */}
        {user && (
            <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden border-t border-gray-100/50 z-50">
                <div className="flex justify-around items-center py-2.5 px-2 safe-area-inset-bottom">
                    <Link href="/dashboard" className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${pathname === '/dashboard' ? 'text-cyan-600' : 'text-gray-400 hover:text-gray-600'}`}>
                        <div className={`absolute inset-0 rounded-xl transition-all duration-200 ${pathname === '/dashboard' ? 'bg-cyan-50/80' : ''}`}></div>
                        <Home size={20} className="relative z-10" strokeWidth={pathname === '/dashboard' ? 2.5 : 2} />
                        <span className={`text-[10px] font-semibold relative z-10 tracking-tight ${pathname === '/dashboard' ? 'text-cyan-600' : 'text-gray-500'}`}>Dashboard</span>
                    </Link>
                    <Link href="/history" className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${pathname === '/history' ? 'text-cyan-600' : 'text-gray-400 hover:text-gray-600'}`}>
                        <div className={`absolute inset-0 rounded-xl transition-all duration-200 ${pathname === '/history' ? 'bg-cyan-50/80' : ''}`}></div>
                        <History size={20} className="relative z-10" strokeWidth={pathname === '/history' ? 2.5 : 2} />
                        <span className={`text-[10px] font-semibold relative z-10 tracking-tight ${pathname === '/history' ? 'text-cyan-600' : 'text-gray-500'}`}>History</span>
                    </Link>
                    <Link href="/profile" className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${pathname === '/profile' ? 'text-cyan-600' : 'text-gray-400 hover:text-gray-600'}`}>
                        <div className={`absolute inset-0 rounded-xl transition-all duration-200 ${pathname === '/profile' ? 'bg-cyan-50/80' : ''}`}></div>
                        <User size={20} className="relative z-10" strokeWidth={pathname === '/profile' ? 2.5 : 2} />
                        <span className={`text-[10px] font-semibold relative z-10 tracking-tight ${pathname === '/profile' ? 'text-cyan-600' : 'text-gray-500'}`}>Profile</span>
                    </Link>
                </div>
            </nav>
        )}
    </>
    )
}
