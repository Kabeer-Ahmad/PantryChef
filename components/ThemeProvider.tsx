'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)
  const themeRef = useRef<Theme>('light')

  // Apply theme function - use useCallback to ensure it's stable
  const applyTheme = useCallback((newTheme: Theme) => {
    if (typeof window === 'undefined') return

    themeRef.current = newTheme
    const root = window.document.documentElement
    // For Tailwind CSS v4, we just need the 'dark' class
    // Force remove first, then add if needed
    root.classList.remove('dark')

    if (newTheme === 'dark') {
      root.classList.add('dark')
    }

    try {
      localStorage.setItem('theme', newTheme)
    } catch (e) {
      // localStorage might not be available
      console.error('Failed to save theme:', e)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    // Always default to light theme, ignore system preferences
    try {
      const savedTheme = localStorage.getItem('theme') as Theme | null
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        themeRef.current = savedTheme
        setThemeState(savedTheme)
        applyTheme(savedTheme)
      } else {
        // Default to light theme (not system preference)
        themeRef.current = 'light'
        setThemeState('light')
        applyTheme('light')
        localStorage.setItem('theme', 'light')
      }
    } catch (e) {
      // If localStorage fails, default to light
      themeRef.current = 'light'
      setThemeState('light')
      applyTheme('light')
    }
  }, [applyTheme])

  const setTheme = useCallback((newTheme: Theme) => {
    themeRef.current = newTheme
    setThemeState(newTheme)
    applyTheme(newTheme)
  }, [applyTheme])

  const toggleTheme = useCallback(() => {
    // Use ref to get current theme immediately (avoids stale closure)
    const currentTheme = themeRef.current
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'

    // Update state
    setThemeState(newTheme)

    // Apply theme immediately to DOM
    applyTheme(newTheme)
  }, [applyTheme])

  // Always provide the context, even before mount
  // This prevents the "must be used within ThemeProvider" error
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    // Return default values if context is not available (shouldn't happen, but safe fallback)
    return {
      theme: 'light' as Theme,
      toggleTheme: () => { },
      setTheme: () => { },
    }
  }
  return context
}

